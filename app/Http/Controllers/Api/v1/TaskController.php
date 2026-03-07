<?php

namespace App\Http\Controllers\Api\v1;

use App\Enums\TaskPriorityEnum;
use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'workflow_id' => ['required', 'uuid'],
            'title' => ['required', 'string', 'max:255'],
            'priority' => ['required', 'string', Rule::enum(TaskPriorityEnum::class)],
        ]);

        try {
            $data['position'] = Task::where('workflow_id', $data['workflow_id'])->max('position') + 1;
            $task = Task::create($data);

            return response()->json([
                'message' => 'Tugas berhasil ditambahkan.',
                'task' => $task,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Gagal menambahkan Tugas.',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    public function update_title(Request $request, Task $task)
    {
        $data = $request->validate([
            'title' => ['required', 'string'],
        ]);

        try {
            $task->update($data);

            return response()->json([
                'message' => 'Berhasil mengubah judul Tugas.',
                'task' => $task,
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Gagal mengubah judul Tugas.',
                'error' => $th->getMessage(),
            ], 500);
        }
    }
}
