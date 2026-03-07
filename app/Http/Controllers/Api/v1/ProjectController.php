<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Models\Project;

class ProjectController extends Controller
{
    public function workflows(Project $project)
    {
        return response()
            ->json([
                'message' => 'Workflows fetched successfully.',
                'workflows' => $project
                    ->workflows()
                    ->orderBy('position')
                    ->get()
            ]);
    }
}
