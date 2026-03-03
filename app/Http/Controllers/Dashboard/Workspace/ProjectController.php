<?php

namespace App\Http\Controllers\Dashboard\Workspace;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\StoreProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Models\Project;
use App\Models\Workspace;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index(Workspace $workspace)
    {
        return Inertia::render('dashboard/workspace/project/index', [
            'workspace' => $workspace,
            'projects' => $workspace
                ->projects
                ->map(function (Project $project) {
                    $project->tasks = [
                        'completed' => 2,
                        'in_progress' => 3,
                        'backlog' => 7,
                    ];

                    return $project;
                }),
        ]);
    }

    public function store(Workspace $workspace, StoreProjectRequest $request)
    {
        $workspace->projects()->create($request->validated());

        return back();
    }

    public function show(Project $project)
    {
        //
    }

    public function update(UpdateProjectRequest $request, Workspace $workspace, Project $project)
    {
        $project->update($request->validated());

        return back();
    }

    public function destroy(Workspace $workspace, Project $project)
    {
        $project->delete();

        return back();
    }

    public function archive(Workspace $workspace, Project $project)
    {
        $project->update([
            'archived_at' => ! empty($project->archived_at)
                ? null
                : now(),
        ]);

        return back();
    }
}
