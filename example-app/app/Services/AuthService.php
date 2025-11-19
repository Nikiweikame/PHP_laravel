<?php

// example-app/app/Services/AuthService.php

namespace App\Services;

use App\Http\Resources\UserResource;
use App\Models\User;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function login(array $credentials)
    {
        try {
            // 嘗試登入並產生 JWT token
            if (! $token = JWTAuth::attempt($credentials)) {
                return [
                    'success' => false,
                    'data' => null,
                    'status' => 'invalid_credentials',
                    'message' => 'Invalid credentials',
                ];
            }
        } catch (JWTException $e) {
            return [
                'success' => false,
                'status' => 'server_error',
                'data' => null,
                'message' => 'Could not create token',
            ];
        }
        // 登入成功，回傳 token + user
        $user = auth()->user(); // 取得登入的使用者
        $user->last_login_at = now();
        $user->save();

        // 判斷是否預設密碼
        $isDefaultPassword = $user->is_default_password;

        // 判斷密碼是否超過 90 天
        $needsPasswordChange = false;
        if ($user->password_change_at && ! $isDefaultPassword) {
            $daysSinceChange = now()->diffInDays($user->password_change_at);
            if ($daysSinceChange >= 90) {
                $needsPasswordChange = true;
            }
        }

        // 密碼狀態
        $passwordStatus = 'ok';
        if ($isDefaultPassword) {
            $passwordStatus = 'default';
        } elseif ($needsPasswordChange) {
            $passwordStatus = 'expired';
        }

        // 使用 UserResource 格式化使用者資料
        $resource = new UserResource($user);

        return [
            'success' => true,
            'status' => 'ok',
            'data' => [
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => JWTAuth::factory()->getTTL() * 60,
                'user' => $resource,
                'password_status' => $passwordStatus,
            ],
            'message' => 'Login successful',
        ];
    }

    public function register(array $credentials)
    {

        try {
            // 建立使用者
            $user = User::create([
                'user_id' => $credentials['user_id'],
                'password' => bcrypt($credentials['password']), // bcrypt 加密
                'nickname' => $credentials['nickname'],
                'weight' => $credentials['weight'] ?? 60.0, // 預設體重 60.0
                'security_question_id' => $credentials['security_question_id'],
                'answer_hash' => bcrypt($credentials['security_answer']), // bcrypt 加密
                'status' => 'active',
                'last_login_at' => null,
                'password_change_at' => now(), // 註冊時預設密碼設定時間
            ]);

            // 註冊完成馬上登入並回傳 token
            $token = JWTAuth::fromUser($user);

            return [
                'success' => true,
                'data' => [
                    'user' => $user,
                    'access_token' => $token,
                    'token_type' => 'bearer',
                    'expires_in' => JWTAuth::factory()->getTTL() * 60,
                ],
                'message' => 'User registered successfully',
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ];
        }
    }

    public function renewPassword(User $user): array
    {
        $user->password_change_at = now();
        $user->is_default_password = false;
        $user->save();

        return [
            'success' => true,
            'message' => '已沿用原密碼並延長使用期限',
        ];
    }

    public function updatePassword(User $user, array $credentials): array
    {
        if (! Hash::check($credentials['old_password'], $user->password)) {
            return ['success' => false, 'message' => '舊密碼錯誤'];
        }

        $user->password = Hash::make($credentials['new_password']);
        $user->is_default_password = false;
        $user->password_change_at = now();
        $user->save();

        return [
            'success' => true,
            'message' => '密碼已成功更新',
        ];
    }

    public function updateUserProfile(User $user, array $credentials): array
    {
        // 更新其他欄位
        if (isset($credentials['nickname'])) {
            $user->nickname = $credentials['nickname'];
        }

        if (isset($credentials['weight'])) {
            $user->weight = $credentials['weight'];
        }

        // 更新安全問題與答案（需要驗證密碼）
        if (isset($credentials['security_question_id']) && isset($credentials['security_answer'])) {
            if (! Hash::check($credentials['password'], $user->password)) {
                return [
                    'success' => false,
                    'message' => '舊密碼錯誤',
                ];
            }
            $user->security_question_id = $credentials['security_question_id'];
            $user->answer_hash = bcrypt($credentials['security_answer']);
        }
        $user->save();

        return [
            'success' => true,
            'message' => '資料更新成功',
            'data' => $user,
        ];
    }

    public function resetPasswordWithSecurityQuestion(User $user, array $credentials): array
    {
        // 驗證安全問題
        if (
            $user->security_question_id != $credentials['security_question_id'] ||
            ! Hash::check($credentials['security_answer'], $user->answer_hash)
        ) {
            return ['success' => false, 'message' => '安全問題或答案錯誤'];
        }

        $newPasswordPlain = config('auth.default_reset_password', '12qwAS');
        $user->is_default_password = true;
        $user->password = Hash::make($newPasswordPlain);
        $user->password_change_at = now();
        $user->save();

        // ⚠️ 不建議回傳明碼，只顯示提示
        return [
            'success' => true,
            'message' => '密碼已重設，請使用新密碼登入後立即修改。',
            // 預設密碼12qwAS
        ];
    }
}
