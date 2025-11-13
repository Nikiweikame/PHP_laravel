<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    // 登入

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'user_id' => 'required|string',
            'password' => 'required|string',
        ]);

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
        $user->lastLogin_at = now();
        $user->save();

        // 判斷是否預設密碼
        $isDefaultPassword = $user->is_default_password;

        // 判斷密碼是否超過 90 天
        $needsPasswordChange = false;
        if ($user->passwordChange_at && ! $isDefaultPassword) {
            $daysSinceChange = now()->diffInDays($user->passwordChange_at);
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
        $Resource = new UserResource($user);

        return response()->json([
            'success' => true,
            'data' => [
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => JWTAuth::factory()->getTTL() * 60,
                'user' => $Resource,
                'password_status' => $passwordStatus,
            ],
            'message' => 'Login successful',
        ]);
    }

    /**
     * 取得當前使用者資料
     */
    public function me()
    {
        $user = auth()->user();

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'User fetched successfully',
        ]);
    }

    /**
     * 使用者登出（將 token 失效）
     */
    public function logout(Request $request)
    {
        $token = $request->bearerToken();
        if ($token) {
            JWTAuth::invalidate($token);
        }

        return response()->json(['success' => true, 'message' => 'Successfully logged out']);
    }

    /**
     * 使用者註冊
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|string|max:50|unique:users,user_id',
            'password' => 'required|string|min:6',
            'nickname' => 'required|string|max:50',
            'weight' => 'nullable|numeric|min:0',
            'security_question_id' => 'required|integer',
            'security_answer' => 'required|string',
        ]);

        try {
            // 建立使用者
            $user = User::create([
                'user_id' => $validated['user_id'],
                'password' => bcrypt($validated['password']), // bcrypt 加密
                'nickname' => $validated['nickname'],
                'weight' => $validated['weight'] ?? 60.0, // 預設體重 60.0
                'security_question_id' => $validated['security_question_id'],
                'answer_hash' => bcrypt($validated['security_answer']), // bcrypt 加密
                'status' => 'active',
                'lastLogin_at' => null,
                'passwordChange_at' => now(), // 註冊時預設密碼設定時間
            ]);

            // 註冊完成馬上登入並回傳 token
            $token = JWTAuth::fromUser($user);

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user,
                    'access_token' => $token,
                    'token_type' => 'bearer',
                    'expires_in' => JWTAuth::factory()->getTTL() * 60,
                ],
                'message' => 'User registered successfully',
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * 更新使用者資料
     */
    public function updateUserProfile(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'nickname' => 'sometimes|string|max:50',
            'weight' => 'sometimes|numeric|min:0',
            'security_question_id' => 'nullable|integer',
            'security_answer' => 'nullable|string',
            'password' => 'required_with:security_answer|string|min:6',
        ]);

        // 更新其他欄位
        if (isset($validated['nickname'])) {
            $user->nickname = $validated['nickname'];
        }

        if (isset($validated['weight'])) {
            $user->weight = $validated['weight'];
        }

        // 更新安全問題與答案（需要驗證密碼）
        if (isset($validated['security_question_id']) && isset($validated['security_answer'])) {
            if (! Hash::check($request->input('password'), $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => '舊密碼錯誤',
                ], 403);
            }
            $user->security_question_id = $validated['security_question_id'];
            $user->answer_hash = bcrypt($validated['security_answer']);
        }
        $user->save();

        return response()->json([
            'success' => true,
            'message' => '資料更新成功',
            'data' => $user,
        ]);
    }

    /**
     * 使用安全問題重設密碼
     * 預設密碼為 12qwAS
     */
    public function resetPasswordBySecurityQuestion(Request $request)
    {
        $validated = $request->validate([
            'account' => 'required|string',
            'security_question_id' => 'required|integer',
            'security_answer' => 'required|string',
        ]);

        // 找使用者
        $user = User::where('user_id', $validated['account'])->first();

        if (! $user) {
            return response()->json(['success' => false, 'message' => '帳號不存在'], 404);
        }

        // 驗證安全問題
        if (
            $user->security_question_id != $validated['security_question_id'] ||
            ! Hash::check($validated['security_answer'], $user->answer_hash)
        ) {
            return response()->json(['success' => false, 'message' => '安全問題或答案錯誤'], 400);
        }

        $newPasswordPlain = '12qwAS';
        $user->is_default_password = true;
        $user->password = Hash::make($newPasswordPlain);
        $user->passwordChange_at = now();
        $user->save();

        // ⚠️ 不建議回傳明碼，只顯示提示
        return response()->json([
            'success' => true,
            'message' => '密碼已重設，請使用新密碼登入後立即修改。',
            // 預設密碼12qwAS
            // ⚠️ 如果是內部測試可以暫時開這一行，正式上線務必關掉
            // 'new_password' => $newPassword
        ]);
    }

    public function updateOrRenewPassword(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'renew' => 'nullable|boolean',
            'old_password' => 'required_with:new_password|string',
            'new_password' => 'required_with:old_password|string|min:6',
            // 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/', // 至少一個大寫、小寫、數字

        ]);

        // ✅ 沿用舊密碼
        if (! empty($validated['renew']) && $validated['renew'] == true) {
            $user->passwordChange_at = now();
            $user->is_default_password = false;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => '已沿用原密碼並延長使用期限',
            ]);
        }

        // ✅ 修改密碼（需要驗證舊密碼）
        if (! empty($validated['old_password']) && ! empty($validated['new_password'])) {
            if (! Hash::check($validated['old_password'], $user->password)) {
                return response()->json(['success' => false, 'message' => '舊密碼錯誤'], 403);
            }

            $user->password = Hash::make($validated['new_password']);
            $user->is_default_password = false;
            $user->passwordChange_at = now();
            $user->save();

            return response()->json([
                'success' => true,
                'message' => '密碼已成功更新',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => '請輸入新密碼或選擇沿用舊密碼',
        ], 400);
    }

    public function renewPassword(Request $request)
    {
        $user = auth()->user();

        // 如果想加安全性，可以驗證密碼
        // if (!Hash::check($request->input('password'), $user->password)) {
        //     return response()->json(['success' => false, 'message' => '密碼錯誤'], 403);
        // }

        $user->passwordChange_at = now();
        $user->is_default_password = false;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => '已沿用原密碼並延長使用期限',
        ]);
    }

    public function updatePassword(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'old_password' => 'required|string',
            'new_password' => 'required|string|min:6',
        ]);

        if (! Hash::check($validated['old_password'], $user->password)) {
            return response()->json(['success' => false, 'message' => '舊密碼錯誤'], 403);
        }

        $user->password = Hash::make($validated['new_password']);
        $user->is_default_password = false;
        $user->passwordChange_at = now();
        $user->save();

        return response()->json([
            'success' => true,
            'message' => '密碼已成功更新',
        ]);
    }
}
