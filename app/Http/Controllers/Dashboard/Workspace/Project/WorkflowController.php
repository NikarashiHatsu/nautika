<?php

namespace App\Http\Controllers\Dashboard\Workspace\Project;

use App\Http\Controllers\Controller;
use App\Http\Requests\Workflow\StoreWorkflowRequest;
use App\Http\Requests\Workflow\UpdateWorkflowRequest;
use App\Models\Project;
use App\Models\Workflow;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class WorkflowController extends Controller
{
    public function store(
        StoreWorkflowRequest $request,
        Workspace $workspace,
        Project $project,
    ) {
        $project->workflows()->create([
            'position' => $project->workflows()->max('position') + 1,
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'is_done' => false,
        ]);

        return back();
    }

    public function update(
        UpdateWorkflowRequest $request,
        Workspace $workspace,
        Project $project,
        Workflow $workflow,
    ) {
        $workflow->update($request->validated());

        return back();
    }

    public function destroy(
        Workspace $workspace,
        Project $project,
        Workflow $workflow,
    ) {
        $workflow->delete();

        return back();
    }

    public function reorder(
        Request $request,
        Workspace $workspace,
        Project $project,
        Workflow $workflow
    ) {
        $request->validate([
            'workflows'            => ['required', 'array'],
            'workflows.*.id'       => ['required', 'string', 'exists:workflows,id'],
            'workflows.*.position' => ['required', 'integer', 'min:0'],
        ]);

        $projectIds = $workspace->projects()->pluck('id');

        DB::transaction(
            function () use ($request, $projectIds) {
                foreach ($request->workflows as $item) {
                    Workflow::whereIn('project_id', $projectIds)
                        ->where('id', $item['id'])
                        ->update(['position' => $item['position']]);
                }
            }
        );

        return back();
    }
}
