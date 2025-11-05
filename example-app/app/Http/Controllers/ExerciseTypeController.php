<?php

namespace App\Http\Controllers;

use App\Models\ExerciseType;
use Illuminate\Http\Request;

class ExerciseTypeController extends Controller
{
    // // 在建構子中加上 jwt.auth 中間件
    // public function __construct()
    // {
    //     $this->middleware('jwt.auth');
    // }

    /**
     * 取得全部運動項目
     */
    public function index()
    {
        // 取得當前使用者
        $user = auth()->user();

        $types = ExerciseType::all()->map(function ($type) use ($user) {
            // 根據 weight_unit 決定公式
            if ($type->weight_unit === 'Y') {
                $formula = '體重 × '.$type->unit.' × '.$type->calories_per_unit;
            } else {
                $formula = $type->unit.' × '.$type->calories_per_unit;
            }
            // 加入新欄位
            $type->formula = $formula;
            // 判斷是否為創造人
            $type->is_creator = $type->creator == $user->id;
            $type->user = $user->id;

            return $type;
        });

        return response()->json([
            'success' => true,
            'data' => $types,
            'message' => 'Items fetched successfully',
        ]);
    }

    /**
     * 新增運動類型
     */
    public function store(Request $request)
    {
        // 取得當前使用者
        $user = auth()->user();

        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:exercise_types,name',
            'weight_unit' => 'required|string|max:1',
            'calories_per_unit' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'unit' => 'required|string|max:100',
        ]);

        $exerciseType = ExerciseType::create([
            'name' => $validated['name'],
            'weight_unit' => $validated['weight_unit'],
            'calories_per_unit' => $validated['calories_per_unit'],
            'description' => $validated['description'],
            'unit' => $validated['unit'],
            'creator' => $user->id,
        ]);

        return response()->json([
            'success' => true,
            'data' => $exerciseType,
            'message' => 'Record created successfully',
        ], 201); // 201 Created
    }

    /**
     * 取得單一運動類型
     */
    public function show($id)
    {
        $exerciseType = ExerciseType::find($id);

        if (! $exerciseType) {
            return response()->json(['success' => false, 'message' => 'Exercise type not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $exerciseType,
            'message' => 'Exercise type fetched successfully',
        ]);
    }

    /**
     * 更新運動類型
     */
    public function update(Request $request, $id)
    {
        // 取得當前使用者
        $user = auth()->user();

        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:exercise_types,name,'.$id,
            'weight_unit' => 'required|string|max:1',
            'calories_per_unit' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'unit' => 'required|string|max:100',
        ]);

        // $exerciseType = ExerciseRecord::where('id', $validated['id'])
        //     ->first();

        $exerciseType = ExerciseType::findOrFail($id);

        // if (! $exerciseType) {
        //     return response()->json(['success' => false, 'message' => 'Exercise type not found'], 404);
        // }

        $exerciseType->update($validated);

        return response()->json([
            'success' => true,
            'data' => $exerciseType,
        ], 200);
    }

    /**
     * 刪除運動類型
     */
    public function destroy($id)
    {

        // 取得當前使用者
        $user = auth()->user();

        $exerciseType = ExerciseType::findOrFail($id);
        // if (! $exerciseType) {
        //     return response()->json(['success' => false, 'message' => 'Exercise type not found'], 404);
        // }

        $exerciseType->delete();

        return response()->json(['success' => true,
            'message' => 'Exercise type deleted successfully'], 200);
    }
}
