<?php

// example-app/app/Services/AuthService.php

namespace App\Services;

use App\Http\Resources\UserResource;
use App\Models\User;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function login(array $credentials)
    {
        try {
            // 嘗試登入並產生 JWT token
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'success' => false,
                    'data' => null,
                    'message' => 'Invalid credentials',
                ], 401);
            }
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'data' => null,
                'message' => 'Could not create token',
            ], 500);
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
}
