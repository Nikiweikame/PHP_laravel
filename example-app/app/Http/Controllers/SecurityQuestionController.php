<?php

namespace App\Http\Controllers;

use App\Http\Resources\SecurityQuestionResource;
use App\Models\SecurityQuestion;

class SecurityQuestionController extends Controller
{
    public function index()
    {
        // 載入所有安全問題
        $securityQuestions = SecurityQuestion::all();

        // 回傳 JSON 格式的安全問題列表
        return response()->json([
            'success' => true,
            'data' => SecurityQuestionResource::collection($securityQuestions),
            'message' => 'Security questions retrieved successfully',
        ], 200);
    }
}
