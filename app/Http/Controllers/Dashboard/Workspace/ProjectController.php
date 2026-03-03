<?php

namespace App\Http\Controllers\Dashboard\Workspace;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\StoreProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Models\Project;
use App\Models\Workspace;
use Illuminate\Support\Facades\DB;
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

    public function store(StoreProjectRequest $request, Workspace $workspace)
    {
        DB::transaction(
            function () use ($workspace, $request) {
                $project = $workspace->projects()->create($request->validated());

                $project->workflows()->create([
                    'position' => 1,
                    'name' => 'Backlog',
                    'slug' => 'backlog',
                    'is_backlog' => true,
                    'is_done' => false,
                ]);

                $project->workflows()->create([
                    'position' => 2,
                    'name' => 'To-do',
                    'slug' => 'to-do',
                    'is_backlog' => false,
                    'is_done' => false,
                ]);

                $project->workflows()->create([
                    'position' => 3,
                    'name' => 'In Progress',
                    'slug' => 'in-progress',
                    'is_backlog' => false,
                    'is_done' => false,
                ]);

                $project->workflows()->create([
                    'position' => 4,
                    'name' => 'Completed',
                    'slug' => 'completed',
                    'is_backlog' => false,
                    'is_done' => true,
                ]);
            }
        );

        return back();
    }

    public function show(Workspace $workspace, Project $project)
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
