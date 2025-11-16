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
            'weight_unit' => true, // 是否依體重計算熱量 true/false
            'calories_per_unit' => '8.3', // 每公斤每小時消耗熱量
            'unit' => '小時', // 計量單位
            'description' => '慢速慢跑（約 8 km/h）', // 說明，可為空
            'creator' => 'system', // 建立者
        ]);
        ExerciseType::create([
            'name' => '健走（6 km/h）',
            'weight_unit' => true,
            'calories_per_unit' => '5.0', // 約 6km/h 快走強度
            'unit' => '小時',
            'description' => '快走（約 6 km/h）',
            'creator' => 'system',
        ]);
    }
}
