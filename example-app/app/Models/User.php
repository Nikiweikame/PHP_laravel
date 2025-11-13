<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
// 認證相關的基底類
use Illuminate\Database\Eloquent\Factories\HasFactory;
// 通知相關
use Illuminate\Foundation\Auth\User as Authenticatable;
// 假資料工廠
use Illuminate\Notifications\Notifiable;
// JWT 相關介面
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject // ✅ implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id', 'password', 'nickname', 'weight', 'security_question_id', 'answer_hash', 'status', 'lastLogin_at', 'passwordChange_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    /**
     * 不會被序列化的欄位（例如轉成 JSON 的時候）
     * API 回傳 JSON 時，不會包含這些欄位
     */
    protected $hidden = ['password', 'answer_hash'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    /**
     * 欄位型別轉換（Casting）
     */
    protected function casts(): array
    {
        return [
            'lastLogin_at' => 'datetime',
            'passwordChange_at' => 'datetime',
            'weight' => 'decimal:2',
        ];
    }

    public function exerciseRecords()
    {
        return $this->hasMany(ExerciseRecord::class);
    }

    public function securityQuestion()
    {
        return $this->belongsTo(SecurityQuestion::class, 'security_question_id', 'id');
    }

    // JWTSubject 需要實作兩個方法
    public function getJWTIdentifier()
    {
        return $this->getKey(); // 通常是 id
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
