<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Course;
use App\User;
use App\Question;
use App\Answer;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class CoursesController extends Controller
{
    public function index(Request $request)
    {
        if ($request->input('category') !== null) {
            $category = $request->input('category');
            return Course::where('category', $category)->get();
        }
        return Course::all();
    }

    public function show(Course $course)
    {
        $responseCourse = $course;
        $questions = $course->questions;
        foreach ($questions as $question) {
            $answers = $question->answers;
            $question->answers = $answers;
        }
        $responseCourse->questions = $questions;
        return response()->json($responseCourse, 200);
    }

    public function store(Request $request)
    {
        $userId = auth()->user()->id;
        $user = User::find($userId);
        if ($user->role !== "teacher" && $user->role !== "admin") {
            return response()->json(["Unauthorized, only teachers or admins can create courses!"], 401);
        }

        $requestElement = $request->all();
        $requestElement["questions"] = json_decode($request->input('questions'));
        $requestElement["answers"] = json_decode($request->input('answers'));

        $validate = Validator::make($requestElement, [
            'title' => 'required|max:100',
            'file' => 'required|file|max:19999|mimes:pdf,docx,txt',
            'image' => 'nullable|image|max:19999|mimes:jpeg,png,jpg',
            'category' => ['nullable', Rule::in(['other', 'maths', 'cs', 'physics', 'chemistry', 'litterature', 'sciences', 'geography', 'history'])],
            'questions' => 'required|array|max:5|min:5',
            'questions.*' => 'required|string|max:255',
            'answers' => 'required|array|max:5|min:5',
            'answers.*' => 'required|array|max:3|min:3'
        ]);
        

        if ($validate->fails()) {
            return response()->json($validate->errors(), 400);
        }

        $questionsArray = $requestElement["questions"];
        $answersArray = $requestElement["answers"];
        if (count($questionsArray) !== count($answersArray)) {
            return response()->json(['Each question must have a set of answers!'], 400);
        }

        //Handle File Upload
        if ($request->hasFile('file')) {
            //Get filename with the extension
            $fileNameWithExt = $request->file('file')->getClientOriginalName();
            //Get just filename
            $filename = pathinfo($fileNameWithExt, PATHINFO_FILENAME);
            //Get just extension
            $extension = $request->file('file')->getClientOriginalExtension();
            //Filename to store
            $fileNameToStore = $filename . '_' . time() . '.' . $extension;
            //Upload the image
            $path = $request->file('file')->storeAs('public/files', $fileNameToStore);
        } else {
            return response()->json("Course file not provided!", 400);
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
            $path = $request->file('image')->storeAs('public/images', $imageNameToStore);
        }

        $course = new Course();
        $course->title = $request->input('title');
        $course->description = htmlspecialchars($request->input('description'));
        if ($request->input('category') != null) {
            $course->category = $request->input('category');
        }

        $course->course_file = $fileNameToStore;
        if ($request->hasFile('image')) {
            $course->course_image = $imageNameToStore;
        }
        $course->user_id = auth()->user()->id;
        $course->save();

        for ($i = 0; $i < count($questionsArray); $i++) {
            $createdQuestion = new Question();
            $createdQuestion->text = htmlspecialchars($questionsArray[$i]);
            $createdQuestion->course_id = $course->id;
            $createdQuestion->save();
            foreach ($answersArray[$i] as $answer) {
                if (!isset($answer)) {
                    return response()->json(['You must provide 3 answers!'], 400);
                }
                if (!isset($answer->text) || !isset($answer->correct)) {
                    return response()->json(['You must provide the answer information!'], 400);
                }
                $createdAnswer = new Answer();
                $createdAnswer->text = htmlspecialchars($answer->text);
                $createdAnswer->correct = $answer->correct;
                $createdAnswer->question_id = $createdQuestion->id;
                $createdAnswer->save();
            };
        }
        return response()->json($course, 201);
    }

    public function update(Request $request, Course $course)
    {
        $userId = auth()->user()->id;
        $user = User::find($userId);
        if ($user->role !== "teacher" && $user->role !== "admin") {
            return response()->json(["Unauthorized, only teachers or admins can update courses!"], 401);
        }

        if ($user->id !== $course->user->id && $user->role !== "admin") {
            return response()->json('Unauthorized', 401);
        }

        $requestElement = $request->all();
        $requestElement["questions"] = json_decode($request->input('questions'));
        $requestElement["answers"] = json_decode($request->input('answers'));

        $validate = Validator::make($requestElement, [
            'title' => 'required|max:100',
            'file' => 'nullable|file|max:19999|mimes:pdf,docx,txt',
            'image' => 'nullable|image|max:19999|mimes:jpeg,png,jpg',
            'category' => ['nullable', Rule::in(['other', 'maths', 'cs', 'physics', 'chemistry', 'litterature', 'sciences', 'geography', 'history'])],
            'questions' => 'required|array|max:5|min:5',
            'questions.*' => 'required|string|max:255',
            'answers' => 'required|array|max:5|min:5',
            'answers.*' => 'required|array|max:3|min:3'
        ]);

        if ($validate->fails()) {
            return response()->json($validate->errors(), 400);
        }

        $questionsArray = $requestElement["questions"];
        $answersArray = $requestElement["answers"];
        if (count($questionsArray) !== count($answersArray)) {
            return response()->json(['Each question must have a set of answers!'], 400);
        }

        //Handle File Upload
        if ($request->hasFile('file')) {
            //Get filename with the extension
            $fileNameWithExt = $request->file('file')->getClientOriginalName();
            //Get just filename
            $filename = pathinfo($fileNameWithExt, PATHINFO_FILENAME);
            //Get just extension
            $extension = $request->file('file')->getClientOriginalExtension();
            //Filename to store
            $fileNameToStore = $filename . '_' . time() . '.' . $extension;
            //Upload the image
            $path = $request->file('file')->storeAs('public/files', $fileNameToStore);
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
            $path = $request->file('image')->storeAs('public/images', $imageNameToStore);
        }

        $course->title = $request->input('title');
        $course->description = htmlspecialchars($request->input('description'));
        if ($request->input('category') != null) {
            $course->category = $request->input('category');
        }
        if ($request->hasFile('file')) {
            Storage::delete('public/files/' . $course->course_file);
            $course->course_file = $fileNameToStore;
        }
        if ($request->hasFile('image')) {
            if (isset($course->course_image)) {
                Storage::delete('public/images/' . $course->course_image);
            }
            $course->course_image = $imageNameToStore;
        }
        $course->save();

        $questions = $course->questions;
        foreach ($questions as $question) {
            $answers = $question->answers;
            foreach ($answers as $answer) {
                Answer::find($answer->id)->delete();
            }
            Question::find($question->id)->delete();
        }

        for ($i = 0; $i < count($questionsArray); $i++) {
            $createdQuestion = new Question();
            $createdQuestion->text = htmlspecialchars($questionsArray[$i]);
            $createdQuestion->course_id = $course->id;
            $createdQuestion->save();
            foreach ($answersArray[$i] as $answer) {
                if (!isset($answer)) {
                    return response()->json(['You must provide 3 answers!'], 400);
                }
                if (!isset($answer->text) || !isset($answer->correct)) {
                    return response()->json(['You must provide the answer information!'], 400);
                }
                $createdAnswer = new Answer();
                $createdAnswer->text = htmlspecialchars($answer->text);
                $createdAnswer->correct = $answer->correct;
                $createdAnswer->question_id = $createdQuestion->id;
                $createdAnswer->save();
            };
        }
        return response()->json($course, 200);
    }

    public function delete(Course $course)
    {
        $userId = auth()->user()->id;
        $user = User::find($userId);
        if ($user->role !== "teacher" && $user->role !== "admin" && $user->role !== "system-admin") {
            return response()->json(["Unauthorized, only teachers or admins can delete courses!"], 401);
        }

        if ($user->id !== $course->user->id && $user->role !== "admin" && $user->role !== "system-admin") {
            return response()->json('Unauthorized', 401);
        }

        Storage::delete('public/files/' . $course->course_file);
        if (isset($course->course_image)) {
            Storage::delete('public/images/' . $course->course_image);
        }
        $course->subscribedUsers()->detach();
        $questions = $course->questions;
        foreach ($questions as $question) {
            $answers = $question->answers;
            foreach ($answers as $answer) {
                Answer::find($answer->id)->delete();
            }
            Question::find($question->id)->delete();
        }
        $course->delete();
        return response()->json(['Course successfully deleted.'], 200);
    }

    public function file(Course $course)
    {
        $userId = auth()->user()->id;
        $user = User::find($userId);

        if ($user->role === "student") {
            $test = $course->subscribedUsers()->where('user_id', $user->id)->get();
            if ($test->count() === 0) {
                return response()->json(['Only subscribed users can download the course.'], 401);
            }
        }
        return response()->download('storage/files/' . $course->course_file);
    }

    public function image(Course $course)
    {
        if (!isset($course->course_image)) {
            return response()->json(null, 204);
        }
        return response()->download('storage/images/' . $course->course_image);
    }
}
