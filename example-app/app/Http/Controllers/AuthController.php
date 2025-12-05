<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\SecurityQuestionResetRequest;
use App\Http\Requests\Auth\UpdatePasswordRequest;
use App\Http\Requests\Auth\UpdateUserProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    // 登入
    public function login(LoginRequest $request)
    {
        $result = $this->authService->login(
            $request->getUserId(),
            $request->getPassword()
        );

        $statusCode = match ($result['status']) {
            'ok' => 200,
            'invalid_credentials' => 401,
            'server_error' => 500,
            default => 400,
        };

        return response()->json($result, $statusCode);
    }

    /**
     * 取得當前使用者資料，目前沒有運用到
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
    public function register(RegisterRequest $request)
    {
        // 簡單邏輯就不放到 Service 了
        $user = User::create([
            'user_id' => $request->user_id,
            'password' => bcrypt($request->password),
            'nickname' => $request->nickname,
            'weight' => $request->weight ?? 60.0,
            'security_question_id' => $request->security_question_id,
            'answer_hash' => bcrypt($request->security_answer),
            'status' => 'active',
            'password_change_at' => now(),
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'success' => true,
            'data' => [
                'user' => new UserResource($user),
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => JWTAuth::factory()->getTTL() * 60,
            ],
            'message' => 'User registered successfully',
        ], Response::HTTP_CREATED);
    }

    /**
     * 更新使用者資料
     */
    public function updateUserProfile(UpdateUserProfileRequest $request)
    {
        $user = auth()->user();

        $credentials = $request->validated();

        $result = $this->authService->updateUserProfile($user, $credentials);

        $status = $result['success'] ? 200 : 403;

        return response()->json($result, $status);
    }

    /**
     * 使用安全問題重設密碼
     * 預設密碼為 12qwAS
     */
    public function resetPasswordWithSecurityQuestion(SecurityQuestionResetRequest $request)
    {
        $credentials = $request->validated();
        // 找使用者
        $user = User::where('user_id', $credentials['account'])->first();

        if (! $user) {
            return response()->json(['success' => false, 'message' => '帳號不存在'], 404);
        }

        $result = $this->authService->resetPasswordWithSecurityQuestion($user, $credentials);

        $status = $result['success'] ? 200 : 400;

        return response()->json($result, $status);
    }

    public function renewPassword(Request $request)
    {
        $user = auth()->user();

        return response()->json($this->authService->renewPassword($user));
    }

    public function updatePassword(updatePasswordRequest $request)
    {
        $user = auth()->user();
        // 型別驗證
        $credentials = $request->validated();

        $result = $this->authService->updatePassword($user, $credentials);

        $status = $result['success'] ? 200 : 403;

        return response()->json($result, $status);

    }
}
