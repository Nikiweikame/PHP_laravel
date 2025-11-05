<?php

namespace Database\Seeders;

use App\Models\ExerciseRecord;
use Illuminate\Database\Seeder;

class ExerciseRecordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ExerciseRecord::factory()->count(100)->create(); // 產生 100 筆假資料
    }
}
