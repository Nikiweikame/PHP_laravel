<?php

namespace Database\Factories;

use App\Models\ExerciseRecord;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ExerciseRecord>
 */
class ExerciseRecordFactory extends Factory
{
    protected $model = ExerciseRecord::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => '1', // 也可以指定固定使用者
            'exercise_type_id' => '1',
            'record_time' => $this->faker->dateTimeThisYear,
            'duration' => $this->faker->numberBetween(1, 100),
            'unit' => '分鐘',
            'calories' => $this->faker->numberBetween(50, 500),
            'created_at' => $this->faker->dateTimeThisYear,
            'updated_at' => now(),
        ];
    }
}
