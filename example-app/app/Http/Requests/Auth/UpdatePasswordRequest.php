<?php

// example-app/app/Http/Requests/Auth/RegisterRequest.php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePasswordRequest extends FormRequest
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
            'old_password' => 'required|string',
            'new_password' => 'required|string|min:6',
        ];
    }

    public function messages()
    {
        return [
            'old_password.required' => '請輸入舊密碼',
            'new_password.min' => '新密碼至少 6 個字元',
        ];
    }
}
