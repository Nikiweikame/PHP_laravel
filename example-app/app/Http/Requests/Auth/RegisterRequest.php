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
            'user_id' => 'required|string|max:50|unique:users,user_id',
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
            'user_id.required' => '請輸入帳號',
            'password.required' => '請輸入密碼',
            'password.min' => '密碼至少 6 個字元',
            'security_question_id.required' => '請輸入安全提問',
            'security_answer.required' => '請輸入安全提問答案',
        ];
    }
}
