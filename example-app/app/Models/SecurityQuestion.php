<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
// Factory假資料
use Illuminate\Database\Eloquent\Model;

class SecurityQuestion extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = ['security_question'];

    public function user()
    {
        return $this->hasMany(User::class, 'security_question_id', 'id');
    }
}
