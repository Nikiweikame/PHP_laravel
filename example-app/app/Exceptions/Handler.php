<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Throwable;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class Handler extends ExceptionHandler
{
    public function render($request, Throwable $exception)
    {
        // 驗證錯誤
        if ($exception instanceof ValidationException) {
            return response()->json([
                'success' => false,
                'message' => $exception->errors(),
            ], 422);
        }

        // JWT token 過期
        if ($exception instanceof TokenExpiredException) {
            return response()->json([
                'success' => false,
                'message' => 'Token has expired',
            ], 401);
        }

        // JWT token 無效
        if ($exception instanceof TokenInvalidException) {
            return response()->json([
                'success' => false,
                'message' => 'Token is invalid',
            ], 401);
        }

        // JWT 生成失敗或其他 JWTException
        if ($exception instanceof JWTException) {
            return response()->json([
                'success' => false,
                'message' => 'Could not create token',
            ], 500);
        }

        // 其他例外交給 Laravel 預設處理
        return parent::render($request, $exception);
    }
}
