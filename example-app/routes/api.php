<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ExerciseRecordController;
use App\Http\Controllers\ExerciseTypeController;
use App\Http\Controllers\SecurityQuestionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Route::get('/users', [UserController::class, 'index']);
// Route::get('/users/{id}', [UserController::class, 'show']);
// Route::post('/users', [UserController::class, 'store']);
// Route::put('/users/{id}', [UserController::class, 'update']);
// Route::delete('/users/{id}', [UserController::class, 'destroy']);

// Route::get('/exerciseType', [ExerciseTypeController::class, 'index']);
// Route::get('/exerciseType/{id}', [ExerciseTypeController::class, 'show']);
// Route::post('/exerciseType', [ExerciseTypeController::class, 'store']);
// Route::put('/exerciseType/{id}', [ExerciseTypeController::class, 'update']);
// Route::delete('/exerciseType/{id}', [ExerciseTypeController::class, 'destroy']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/reset-password', [AuthController::class, 'resetPasswordBySecurityQuestion']);
Route::get('/securityQuestion', [SecurityQuestionController::class, 'index']);

// 需要 JWT 驗證的路由
Route::middleware('jwt.auth')->group(function () {
    // auth
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateUserProfile']);
    Route::put('/password/update', [AuthController::class, 'updatePassword']);
    Route::post('/password/renew', [AuthController::class, 'renewPassword']);
    // exercise records
    Route::get('/exercise-records', [ExerciseRecordController::class, 'index']);
    Route::post('/exercise-records', [ExerciseRecordController::class, 'store']);
    Route::put('/exercise-records/{id}', [ExerciseRecordController::class, 'update']);
    Route::delete('/exercise-records/{id}', [ExerciseRecordController::class, 'destroy']);
    // exercise types
    Route::get('/exercise-types', [ExerciseTypeController::class, 'index']);
    Route::post('/exercise-types', [ExerciseTypeController::class, 'store']);
    Route::put('/exercise-types/{id}', [ExerciseTypeController::class, 'update']);
    Route::delete('/exercise-types/{id}', [ExerciseTypeController::class, 'destroy']);
});

// Route::apiResource('users', UserController::class);
// Route::apiResource('exercise-types', ExerciseTypeController::class);
// Route::apiResource('exercise-records', ExerciseRecordController::class);
