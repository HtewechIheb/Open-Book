<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ['text'];

    public function course(){
        return $this->belongsTo('App\Course');
    }

    public function answers(){
        return $this->hasMany('App\Answer');
    }
}
