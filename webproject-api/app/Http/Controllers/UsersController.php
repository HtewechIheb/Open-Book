<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use JWTAuth;
use App\User;
use App\Course;
use App\Role;
use App\Mail\TestMail;
use Mail;

class UsersController extends Controller
{
    public function index(){
        $userId = auth()->user()->id;
        $user = User::find($userId);
        if($user->role !== "admin" && $user->role !== "system-admin"){
            return response()->json(['Unauthorized, only admins can view users'],  401);
        }
        return response()->json(User::all(), 200);
    }

    public function show($requestedUserId){
        $userId = auth()->user()->id;
        $user = User::find($userId);
        if($user->role !== "admin" && $user->role !== "system-admin"){
            return response()->json(['Unauthorized, only admins can view users'],  401);
        }

        $requestedUser = User::find($requestedUserId);
        return response()->json($requestedUser, 200);
    }

    public function store(Request $request){
        $roles = [];
        foreach(Role::select('name')->get()->toArray() as $role){
            $roles[] = $role['name'];
        }

        $validate = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'image' => 'nullable|image|max:19999|mimes:jpeg,png,jpg',
            'role' => ['required', Rule::in($roles)]
        ]);

        if($validate->fails()){
            return response()->json($validate->errors(), 400);
        }

        $userId = auth()->user()->id;
        $user = User::find($userId);
        if($user->role !== "admin" && $user->role !== "system-admin"){
            return response()->json(['Unauthorized, only admins can create users'],  401);
        }

        if($request->input('role') === "admin" && $user->role !== "system-admin"){
            return response()->json(['Unauthorized, only system administrators can setup admin accounts'],  401);
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

        $newUser = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'role' => $request->input('role'),
            'image' => ($request->hasFile('image') ? $imageNameToStore : null),
            'password' => Hash::make($request->input('password')),
        ]);

        return response()->json([
            'user' => $newUser
        ], 200);
    }

    public function update(Request $request, $requestedUserId){      
        $userId = auth()->user()->id;
        $user = User::find($userId);

        $roles = [];
        foreach(Role::select('name')->get()->toArray() as $role){
            $roles[] = $role['name'];
        }

        $validate = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => 'required|string|min:6',
            'image' => 'nullable|image|max:19999|mimes:jpeg,png,jpg',
            'role' => ['required', Rule::in($roles)]
        ]);

        if($validate->fails()){
            return response()->json($validate->errors(), 400);
        }

        if($user->role !== "admin" && $user->role !== "system-admin" && $requestedUserId != $userId){
            return response()->json(['Unauthorized, only admins and account owner can edit this account'],  401);
        }

        $requestedUser = User::find($requestedUserId);
        if(($requestedUser->role === "admin" && $user->role !== "system-admin") || ($request->input('role') === "admin" && $user->role !== "system-admin")){
            return response()->json(['Unauthorized, only system administrators can setup admin accounts'],  401);
        }

        if($request->input('role') !== $requestedUser->role){
            return response()->json(['Changing user roles is not allowed.'], 403);
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

        $requestedUser->name = $request->input('name');
        if($request->input('email')){
            $requestedUser->email = $request->input('email');
        }
        $requestedUser->password = Hash::make($request->input('password'));
        if ($request->hasFile('image')) {
            if (isset($requestedUser->image)) {
                Storage::delete('public/images/users/' . $requestedUser->image);
            }
            $requestedUser->image = $imageNameToStore;
        }
        $requestedUser->save();
        $token = JWTAuth::fromUser($user);
        return response()->json([
            'user' => $requestedUser,
            'token' => $token
        ], 200);
    }

    public function delete($requestedUserId){
        $userId = auth()->user()->id;
        $user = User::find($userId);
        if($user->role !== "admin" && $user->role !== "system-admin" && $requestedUserId != $userId){
            return response()->json(['Unauthorized, only admins and account owner can delete this account'],  401);
        }

        $requestedUser = User::find($requestedUserId);
        if($requestedUser->role === "admin" && $user->role !== "system-admin"){
            return response()->json(['Unauthorized, only system administrators can setup admin accounts'],  401);
        }

        if($requestedUser->role === "student"){
            $requestedUser->subscribedCourses()->detach();
        }

        if($requestedUser->role === "teacher"){
            foreach($requestedUser->courses as $course){
                app('App\Http\Controllers\CoursesController')->delete(Course::find($course->id));
            }
        }

        if (isset($requestedUser->image)) {
            Storage::delete('public/images/users/' . $requestedUser->image);
        }

        $requestedUser->delete();
        return response()->json(['Successfully deleted user.'], 200);
    }

    public function showCourses()
    {
        $userId = auth()->user()->id;
        $user = User::find($userId);
        if($user->role !== "teacher" && $user->role !== "admin"){
            return response()->json(["Unauthorized, only teachers can own courses!"], 401);
        }
        else if($user->role === "admin"){
            $courses = Course::all();
            foreach($courses as $course){
                $course->user;
            }
            return response()->json($courses,  200);
        }
        $courses = $user->courses;
        return $courses;
    }

    public function image(){
        $userId = auth()->user()->id;
        $user = User::find($userId);
        if(!isset($user->image)){
            return response()->json(null, 204);
        }
        return response()->download('storage/images/users/' . $user->image);
    }  
}
