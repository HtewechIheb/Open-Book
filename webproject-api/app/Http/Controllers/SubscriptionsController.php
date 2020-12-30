<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Course;
use App\Subscription;
use App\User;
use Illuminate\Support\Facades\Validator;

class SubscriptionsController extends Controller
{
    public function index()
    {
        $userId = auth()->user()->id;
        $user = User::find($userId);
        if ($user->role !== "admin") {
            return response()->json($user->subscribedCourses, 200);
        }
        $subscriptions =  Subscription::all();
        foreach ($subscriptions as $subscription) {
            $subscription["user"] = User::select('name')->where('id', $subscription["user_id"])->get()->first()["name"];
            $subscription["course"] = Course::select('title')->where('id', $subscription["course_id"])->get()->first()["title"];
        }
        return response()->json($subscriptions, 200);
    }

    public function store(Course $course)
    {
        $userId = auth()->user()->id;
        $user = User::find($userId);
        if($user->role !== "student"){
            return response()->json(['Only students can subscribe to courses!'], 401);
        }
        $test = $course->subscribedUsers()->where('user_id', $userId)->get();
        if ($test->count() !== 0) {
            return response()->json(['User already subscribed to course!'], 403);
        }
        $course->subscribedUsers()->attach($userId);
        return response()->json(['Successfully subscribed to course.'], 200);
    }

    public function update(Course $course, Request $request)
    {
        $userId = auth()->user()->id;
        $user = User::find($userId);
        if($user->role !== "student"){
            return response()->json(['Only students pass tests!'], 401);
        }
        $test = $course->subscribedUsers()->where('user_id', $userId)->get();
        if ($test->count() === 0) {
            return response()->json(['User must subscribe to course before passing the test!'], 403);
        }
        // $course->subscribedUsers()->detach($userId);
        // $course->subscribedUsers()->attach($userId, ['status' => 'Passed']);
        $course->subscribedUsers()->updateExistingPivot($userId, ['status' => 'Passed']);
        return response()->json(['Successfully passed test.'], 200);
    }

    public function delete(Course $course, Request $request)
    {
        $userId = auth()->user()->id;
        $user = User::find($userId);
        if ($user->role === "admin") {
            $validate = Validator::make($request->all(), [
                'param_user_id' => 'integer'
            ]);

            if($validate->fails()){
                return response()->json($validate->errors(), 400);
            }
            
            if ($request->input('param_user_id') === null) {
                return response()->json(['User ID was not provided!'], 400);
            }
            $test = $course->subscribedUsers()->where('user_id', $request->input('param_user_id'))->get();
            if ($test->count() === 0) {
                return response()->json(['Subscription does not exist!'], 404);
            }
            $course->subscribedUsers()->detach($request->input('param_user_id'));
        } else {
            $test = $course->subscribedUsers()->where('user_id', $userId)->get();
            if ($test->count() === 0) {
                return response()->json(['Subscription does not exist!'], 404);
            }
            $course->subscribedUsers()->detach($userId);
        }
        return response()->json(['Successfully unsubscribed from course.'], 200);
    }
}
