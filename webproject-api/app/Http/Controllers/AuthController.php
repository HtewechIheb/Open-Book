<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use App\Role;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use Illuminate\Foundation\Auth\ResetsPasswords;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    use SendsPasswordResetEmails, ResetsPasswords {
        SendsPasswordResetEmails::broker insteadof ResetsPasswords;
        ResetsPasswords::credentials insteadof SendsPasswordResetEmails;
    }

    public function login(Request $request)
    {
        $credentials = request(['email', 'password']);

        try {
            if (!$token = auth()->attempt($credentials)) {
                return response()->json(['Invalid Credentials!'], 401);
            }
        } catch (JWTException $e) {
            return response()->json(['Could not create token!'], 500); // Something went wrong whilst attempting to encode the token
        }
        $user = auth()->user();

        return response()->json(compact('user', 'token'), 201);
    }

    public function register(Request $request)
    {
        $roles = [];
        foreach (Role::select('name')->get()->toArray() as $role) {
            $roles[] = $role['name'];
        }
        unset($roles[array_search('admin', $roles)]);

        $validate = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'image' => 'nullable|image|max:19999|mimes:jpeg,png,jpg',
            'role' => ['required', Rule::in($roles)]
        ]);

        if ($validate->fails()) {
            return response()->json($validate->errors(), 400);
        }

        //Handle File Upload
        if ($request->hasFile('image')) {
            //Get filename with the extension
            $imageNameWithExt = $request->file('image')->getClientOriginalName();
            //Get just filename
            $imagename = pathinfo($imageNameWithExt, PATHINFO_FILENAME);
            //Get just extension
            $extension = $request->file('image')->getClientOriginalExtension();
            //Filename to store
            $imageNameToStore = $imagename . '_' . time() . '.' . $extension;
            //Upload the image
            $path = $request->file('image')->storeAs('public/images/users', $imageNameToStore);
        }

        $user = User::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'role' => $request->get('role'),
            'image' => ($request->hasFile('image') ? $imageNameToStore : null),
            'password' => Hash::make($request->get('password')),
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json(compact('user', 'token'), 201);
    }

    public function logout(Request $request)
    {
        auth()->logout();
        return response()->json(['Successfully logged out.'], 200);
    }

    public function sendPasswordResetLink(Request $request)
    {
        return $this->sendResetLinkEmail($request);
    }

    public function callResetPassword(Request $request)
    {
        return $this->reset($request);
    }
}
