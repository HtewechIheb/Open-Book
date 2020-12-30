<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = ['title', 'description'];

    public function user(){
        return $this->belongsTo('App\User');
    }

    public function subscribedUsers(){
        return $this->belongsToMany('App\User', 'subscriptions')->withPivot('course_id', 'user_id', 'status')->withTimestamps();
    }

    public function questions(){
        return $this->hasMany('App\Question');
    }
}
