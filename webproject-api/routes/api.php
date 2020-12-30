<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['middleware' => 'jwt'], function(){
    Route::post('/logout', 'AuthController@logout');

    Route::post('/courses', 'CoursesController@store');
    Route::put('/courses/{course}', 'CoursesController@update');
    Route::delete('/courses/{course}', 'CoursesController@delete');
    Route::get('/courses/{course}/file', 'CoursesController@file')->middleware('no-cache');
    
    Route::get('/courses/subscriptions', 'SubscriptionsController@index');
    Route::post('/courses/{course}/subscriptions', 'SubscriptionsController@store');
    Route::put('/courses/{course}/subscriptions', 'SubscriptionsController@update');
    Route::delete('/courses/{course}/subscriptions', 'SubscriptionsController@delete');

    Route::get('/users', 'UsersController@index');
    Route::post('/users', 'UsersController@store');
    Route::get('/users/image', 'UsersController@image')->middleware('no-cache');
    Route::get('/users/courses', 'UsersController@showCourses');
    Route::get('/users/{id}', 'UsersController@show');
    Route::put('/users/{id}', 'UsersController@update');
    Route::delete('/users/{id}', 'UsersController@delete');
});

Route::post('/login', 'AuthController@login');
Route::post('/register', 'AuthController@register');
Route::post('/forgot/password', 'AuthController@sendPasswordResetLink');
Route::post('/reset/password', 'AuthController@callResetPassword');

Route::get('/courses', 'CoursesController@index');
Route::get('/courses/{course}/image', 'CoursesController@image')->middleware('no-cache');
Route::get('/courses/{course}', 'CoursesController@show');
