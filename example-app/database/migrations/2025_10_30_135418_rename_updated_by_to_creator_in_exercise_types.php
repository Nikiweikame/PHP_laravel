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
        Schema::table('exercise_types', function (Blueprint $table) {
            $table->renameColumn('updated_by', 'creator'); // 改成你想要的名稱
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exercise_types', function (Blueprint $table) {
            $table->renameColumn('creator', 'updated_by');
        });
    }
};
