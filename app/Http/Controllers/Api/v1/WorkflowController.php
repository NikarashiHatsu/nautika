<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Workflow;
use Illuminate\Http\Request;

class WorkflowController extends Controller
{
    public function tasks(Workflow $workflow)
    {
        return response()
            ->json([
                'message' => 'Tasks fetched successfully.',
                'tasks' => $workflow
                    ->tasks()
                    ->orderBy('position')
                    ->get(),
            ]);
    }
}
