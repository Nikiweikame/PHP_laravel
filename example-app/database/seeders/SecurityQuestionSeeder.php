<?php

namespace Database\Seeders;

use App\Models\SecurityQuestion;
use Illuminate\Database\Seeder;

class SecurityQuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $questions = [
            '你第一隻寵物的名字是什麼？',
            '你童年最要好的朋友是誰？',
            '你小學的名字是什麼？',
            '你第一次出國旅遊是去哪個國家？',
            '你成長的街道名稱是什麼？',
        ];
        foreach ($questions as $question) {
            SecurityQuestion::create(['security_question' => $question]);
        }
    }
}
