<?php

// example-app/app/Http/Requests/Auth/RegisterRequest.php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserProfileRequest extends FormRequest
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
            'nickname' => 'sometimes|string|max:50',
            'weight' => 'sometimes|numeric|min:0',
            'security_question_id' => 'nullable|integer',
            'security_answer' => 'nullable|string',
            'password' => 'required_with:security_answer|string|min:6',
        ];
    }

    public function messages()
    {
        return [
            'nickname.string' => '暱稱必須為字串',
            'nickname.max' => '暱稱不能超過 50 個字元',

            'weight.numeric' => '體重必須是數字',
            'weight.min' => '體重不能為負數',

            'security_question_id.integer' => '安全問題編號格式錯誤',

            'security_answer.string' => '安全問題答案必須是字串',

            'password.required_with' => '提供安全問題答案時，必須設定新密碼',
            'password.string' => '密碼必須是字串',
            'password.min' => '密碼至少需要 6 個字元',
        ];
    }
}
