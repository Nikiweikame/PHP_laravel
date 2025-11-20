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
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // id INT AUTO_INCREMENT PRIMARY KEY
            $table->string('user_id', 50)->unique(); // 使用者帳號，建議加 unique
            $table->string('password', 255); // 密碼雜湊
            $table->string('nickname', 50); // 暱稱
            $table->decimal('weight', 10, 2)->nullable(); // 體重，可為空
            $table->foreignId('security_question_id')->constrained('security_questions')->onDelete('cascade'); // 安全提問，外鍵，參考 security_questions 表的 id 欄位
            $table->string('answer_hash'); // 加密後的答案
            $table->enum('status', ['active', 'inactive', 'pending']); // 帳號狀態
            $table->dateTime('last_login_at')->nullable(); // 最後登入時間，可為空
            $table->dateTime('password_change_at')->nullable(); // 密碼變更時間，可為空
            $table->boolean('is_default_password')->default(false);
            $table->timestamps(); // created_at, updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
