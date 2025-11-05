<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * 取得全部使用者
     */
    public function index()
    {
        // 載入所有使用者
        return User::all();
    }

    /**
     * 取得單一使用者
     */
    public function show($id)
    {
        $user = User::findOrFail($id); // 找不到會自動 404

        return $user;
    }

    /**
     * 新增使用者
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|string|unique:users,user_id',
            'password' => 'required|string',
            'nickname' => 'required|string',
            'weight' => 'nullable|numeric',
            'status' => 'nullable|string',
        ]);

        $user = User::create($validated);

        return response()->json($user, 201);
    }

    /**
     * 更新使用者
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'nickname' => 'sometimes|string',
            'weight' => 'sometimes|numeric',
            'status' => 'sometimes|string',
        ]);

        $user->update($validated);

        return response()->json($user);
    }

    /**
     * 刪除使用者
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }
}
