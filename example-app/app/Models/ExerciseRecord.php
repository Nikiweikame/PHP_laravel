<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
// Factory假資料
use Illuminate\Database\Eloquent\Model;

class ExerciseRecord extends Model
{
    use HasFactory;

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $fillable = ['user_id', 'exercise_type_id', 'record_time', 'count', 'unit', 'calories'];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    // protected $table = 'exercise_types';

    public function exerciseType()
    {
        // 這裡可以省略外鍵和本地鍵，Laravel會自動推斷
        // return $this->belongsTo(ExerciseType::class, 'exercise_type_id', 'id');
        return $this->belongsTo(ExerciseType::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
