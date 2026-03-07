<?php

namespace App\Http\Controllers\Dashboard\Workspace\Project;

use App\Http\Controllers\Controller;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KanbanController extends Controller
{
    public function __invoke(Request $request, Workspace $workspace)
    {
        $projects = $workspace->projects()
            ->whereNull('archived_at')
            ->orderBy('created_at')
            ->get();

        $selectedProject = $projects->firstWhere('id', $request->query('project'))
            ?? $projects->first();

        $workflows = $selectedProject
            ? $selectedProject->workflows()->orderBy('position')->get()
            : collect();

        return Inertia::render('dashboard/workspace/project/kanban-v2', [
            'workspace' => $workspace,
            'projects' => $projects,
            'selectedProject' => $selectedProject,
            'workflows' => $workflows,
        ]);
    }

}
