<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('exercise_types', function (Blueprint $table) {
            $table->id(); // id INT AUTO_INCREMENT PRIMARY KEY
            $table->string('name', 100); //
            $table->boolean('weight_unit')->default(false); // 是否要計算體重
            $table->decimal('calories_per_unit', 6, 2); // 每單位消耗卡路里
            $table->string('unit', 100); // 單位
            $table->text('description')->nullable(); // 說明，可為空
            $table->string('creator', 50); // 更新人
            $table->softDeletes(); // 新增 deleted_at 欄位
            $table->timestamps(); // created_at, updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exercise_types');
    }
};
