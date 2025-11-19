<?php

// example-app/app/Http/Requests/Auth/RegisterRequest.php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class SecurityQuestionResetRequest extends FormRequest
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
            'account' => 'required|string',
            'security_question_id' => 'required|integer',
            'security_answer' => 'required|string',
        ];
    }

    public function messages()
    {
        return [
            'account.required' => '帳號為必填欄位',
            'account.string' => '帳號格式不正確',

            'security_question_id.required' => '請選擇安全問題',
            'security_question_id.integer' => '安全問題編號格式不正確',

            'security_answer.required' => '請輸入安全問題答案',
            'security_answer.string' => '安全問題答案格式不正確',
        ];
    }
}
