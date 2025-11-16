<?php

namespace App\Models;

// Factory假資料
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExerciseType extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $fillable = ['name', 'weight_unit', 'calories_per_unit', 'description', 'unit', 'creator'];

    protected $casts = [
        'weight_unit' => 'boolean',
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'exercise_types';

    public function exerciseRecords()
    {
        // 包含已刪除的紀錄
        return $this->hasMany(ExerciseRecord::class)->withTrashed();
    }
}
