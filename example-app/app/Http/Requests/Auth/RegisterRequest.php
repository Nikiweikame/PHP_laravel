<?php

// example-app/app/Http/Requests/Auth/RegisterRequest.php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'account' => 'required|string|max:50|unique:users,user_id',
            'password' => 'required|string|min:6',
            'nickname' => 'required|string|max:50',
            'weight' => 'nullable|numeric|min:0',
            'security_question_id' => 'required|integer',
            'security_answer' => 'required|string',
        ];
    }

    public function messages()
    {
        return [
            'account.required' => '請輸入帳號',
            'account.unique' => '帳號已經被註冊',
            'password.required' => '請輸入密碼',
            'password.min' => '密碼至少 6 個字元',
            'security_question_id.required' => '請輸入安全提問',
            'security_answer.required' => '請輸入安全提問答案',
        ];
    }

    // --------------------
    // Getter Methods
    // --------------------

    public function getUserId(): string
    {
        return $this->input('account');
    }

    public function getPassword(): string
    {
        return $this->input('password');
    }

    public function getNickname(): string
    {
        return $this->input('nickname');
    }

    public function getWeight(): ?float
    {
        return $this->input('weight');
    }

    public function getSecurityQuestionId(): int
    {
        return (int) $this->input('security_question_id');
    }

    public function getSecurityAnswer(): string
    {
        return $this->input('security_answer');
    }
}
