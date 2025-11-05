<?php

namespace App\Http\Controllers;

use App\Models\ExerciseRecord;
use App\Models\ExerciseType;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ExerciseRecordController extends Controller
{
    // 在建構子中加上 jwt.auth 中間件
    // 現在包在 middleware 裡面了，所以不需要用中間件
    // public function __construct()
    // {
    //     $this->middleware('jwt.auth');
    // }

    /**
     * 列出使用者運動紀錄，可依運動類型過濾
     */
    public function index(Request $request)
    {
        // 取得當前使用者
        $user = auth()->user();

        // 取得年月參數，格式假設為 YYYY-MM
        $yearMonth = $request->input('year_month'); // 例: '2025-10'
        if (! $yearMonth) {
            return response()->json([
                'success' => false,
                'data' => [],
                'message' => 'year_month is required',
            ], 422);
        }

        // 解析年月
        try {
            $startDate = Carbon::createFromFormat('Y-m', $yearMonth)->startOfMonth();
            $endDate = $startDate->copy()->endOfMonth();
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'data' => [],
                'message' => 'Invalid year_month format, expected YYYY-MM',
            ], 422);
        }

        // ExerciseRecord 查詢
        $records = ExerciseRecord::with(['exerciseType' => function ($query) {
            $query->withTrashed(); // 包含已軟刪除的 ExerciseType
        }])
            ->where('user_id', $user->id)
            ->whereBetween('record_time', [$startDate, $endDate])
            ->orderBy('record_time', 'asc')
            ->orderBy('exercise_type_id', 'asc')
            ->get()
            ->map(function ($record) {
                $exerciseType = $record->exerciseType;
                // 計算 formula（注意 exerciseType 可能是 null）
                if ($exerciseType) {
                    if ($exerciseType->weight_unit === 'Y') {
                        $formula = '體重 × '.$exerciseType->unit.' × '.$exerciseType->calories_per_unit;
                    } else {
                        $formula = $exerciseType->unit.' × '.$exerciseType->calories_per_unit;
                    }
                } else {
                    $formula = null;
                }

                return [
                    'id' => $record->id,
                    'exercise_type' => $record->exerciseType->name ?? null, // 即便已刪除仍會顯示
                    'exercise_type_id' => $record->exercise_type_id,
                    'date' => Carbon::parse($record->record_time)->format('Y-m-d'),
                    'day_only' => Carbon::parse($record->record_time)->format('d'),
                    'time' => Carbon::parse($record->record_time)->format('H:i'),
                    'count' => $record->count,
                    'unit' => $record->unit,
                    'calories' => $record->calories,
                    'recorded_at' => $record->created_at->toDateTimeString(),
                    'description' => $record->exerciseType->description ?? null,
                    'formula' => $formula,
                    'calories_per_unit' => $record->exerciseType->calories_per_unit,
                ];
            });

        $totalCalories = round($records->sum('calories'), 2); // 🔹 計算總和

        return response()->json([
            'success' => true,
            'data' => [
                'records' => $records,
                'total_calories' => $totalCalories,
            ],
            'message' => 'Records fetched successfully',
        ]);
    }

    public function store(Request $request)
    {
        // 取得當前使用者
        $user = auth()->user();
        // 驗證輸入
        $validated = $request->validate([
            'exercise_type_id' => 'required|exists:exercise_types,id',
            'record_time' => 'required|date',
            'count' => 'required|integer|min:1',
            'unit' => 'required|string|max:100',
            'calories' => 'required|numeric|min:0',
        ]);
        // 建立紀錄
        $record = ExerciseRecord::create([
            'user_id' => $user->id,
            'exercise_type_id' => $validated['exercise_type_id'],
            'record_time' => $validated['record_time'],
            'count' => $validated['count'],
            'unit' => $validated['unit'],
            'calories' => $validated['calories'],
        ]);

        // 回傳結果
        return response()->json([
            'success' => true,
            'data' => $record,
            'message' => 'Record created successfully',
        ], 201); // 201 Created
    }

    /**
     * 顯示指定運動紀錄
     */
    // public function getRecords(Request $request)
    // {
    //     $user = auth()->user(); // 從 JWT 拿使用者
    //     $exerciseTypeId = $request->input('exercise_type_id'); // 從前端拿條件

    //     $query = ExerciseRecord::where('user_id', $user->id);

    //     if ($exerciseTypeId) {
    //         $query->where('exercise_type_id', $exerciseTypeId);
    //     }

    //     $records = $query->get(); // 取得結果，多筆查詢

    //     return response()->json([
    //         'success' => true,
    //         'data' => $records,
    //     ]);
    // }

    /**
     * 更新指定運動紀錄
     */
    public function update(Request $request, $id)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'exercise_type_id' => 'required|exists:exercise_types,id',
            'record_time' => 'required|date',
            'count' => 'required|integer|min:1',
            'unit' => 'required|string|max:100',
            'calories' => 'required|numeric|min:0',
        ]);

        $record = ExerciseRecord::where('user_id', $user->id)
            ->where('id', $id) // ✅ 用路由參數
            ->first();

        if (! $record) {
            return response()->json(['success' => false, 'message' => 'Record not found'], 404);
        }

        $record->update([
            'exercise_type_id' => $validated['exercise_type_id'],
            'record_time' => $validated['record_time'],
            'count' => $validated['count'],
            'unit' => $validated['unit'],
            'calories' => $validated['calories'],
        ]);

        return response()->json([
            'success' => true,
            'data' => $record,
            'message' => 'Record updated successfully',
        ], 200);
    }

    /**
     * 刪除指定運動紀錄
     */
    public function destroy($id)
    {
        $user = auth()->user();
        $record = ExerciseRecord::where('user_id', $user->id)
            ->where('id', $id)
            ->first();

        if (! $record) {
            return response()->json([
                'success' => false,
                'message' => 'Record not found',
            ], 404);
        }

        $record->delete();

        return response()->json([
            'success' => true,
            'data' => null,
            'message' => 'Exercise record deleted successfully',
        ], 200);
    }
}
