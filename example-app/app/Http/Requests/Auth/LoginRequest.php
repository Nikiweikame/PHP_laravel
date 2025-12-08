<?php

// example-app/app/Http/Requests/Auth/LoginRequest.php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
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
            'password' => 'required|string|min:6',
        ];
    }

    public function messages()
    {
        return [
            'account.required' => '請輸入帳號',
            'password.required' => '請輸入密碼',
            'password.min' => '密碼至少 6 個字元',
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
}
