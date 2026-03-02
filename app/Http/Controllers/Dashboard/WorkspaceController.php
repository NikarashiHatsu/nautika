<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Http\Requests\Workspace\StoreWorkspaceRequest;
use App\Http\Requests\Workspace\UpdateWorkspaceRequest;
use App\Models\Workspace;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class WorkspaceController extends Controller
{
    public function index(Request $request)
    {
        $allowedSorts = [
            'name',
            'slug',
            'description',
            'created_at',
        ];

        $sort = in_array($request->get('sort'), $allowedSorts)
            ? $request->get('sort')
            : 'created_at';

        $direction = $request->get('direction') === 'asc'
            ? 'asc'
            : 'desc';

        $search = $request->get('search', '');

        $perPage = (int) $request->get('per_page', 10);
        $allowedPerPage = [10, 25, 50, 100];

        if (! in_array($perPage, $allowedPerPage, true)) {
            $perPage = 10;
        }

        $workspaces = Workspace::query()
            ->where('owner_id', auth()->id())
            ->when(
                ! empty($search),
                fn (Builder $query) => $query
                    ->where(function (Builder $query) use ($search) {
                        $query->where('name', 'like', "%{$search}%")
                            ->orWhere('slug', 'like', "%{$search}%")
                            ->orWhere('description', 'like', "%{$search}%");
                    }),
            )
            ->orderBy(column: $sort, direction: $direction)
            ->paginate(perPage: $perPage)
            ->withQueryString();

        return Inertia::render('dashboard/workspace/index', [
            'workspaces' => $workspaces,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function store(StoreWorkspaceRequest $request)
    {
        Workspace::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'owner_id' => Auth::id(),
        ]);

        return redirect()->back();
    }

    public function show(Workspace $workspace)
    {
        //
    }

    public function update(UpdateWorkspaceRequest $request, Workspace $workspace)
    {
        $workspace->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
        ]);

        return redirect()->back();
    }

    public function destroy(Workspace $workspace)
    {
        $workspace->delete();

        return redirect()->back();
    }
}
