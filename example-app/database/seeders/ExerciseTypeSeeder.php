<?php

namespace Database\Seeders;

use App\Models\ExerciseType;
use Illuminate\Database\Seeder;

class ExerciseTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ExerciseType::create([
            'name' => '慢跑', // 運動名稱
            'weight_unit' => 'Y', // 是否依體重計算熱量 Y/N
            'calories_per_unit' => '8.3', // 每公斤每分鐘消耗熱量
            'unit' => '小時', // 計量單位
            'description' => '慢速慢跑（約 8 km/h）', // 說明，可為空
            'creator' => 'system', // 建立者
        ]);
    }
}
