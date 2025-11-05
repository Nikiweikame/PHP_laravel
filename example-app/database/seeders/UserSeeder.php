<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder; // ← 這行一定要加

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'user_id' => 'niki',
            'password' => bcrypt('123456'),
            'nickname' => '烏龜',
            'weight' => 77.5,
            'security_question_id' => 1, // 假設這是第一個安全問題的 ID
            'answer_hash' => bcrypt('龜'), // 假設答案是寵
            'status' => 'active',
            'last_login_at' => now(),
            'password_change_at' => now(),
        ]);
    }
}
