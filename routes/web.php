<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::group(['prefix' => 'dashboard', 'as' => 'dashboard.'], function () {
        Route::resource('/workspace', \App\Http\Controllers\Dashboard\WorkspaceController::class)->except(['create', 'edit']);

        Route::group(['prefix' => '/workspace/{workspace}', 'as' => 'workspace.'], function () {
            Route::get('/kanban', [\App\Http\Controllers\Dashboard\Workspace\Project\KanbanController::class, 'index'])->name('kanban.index');

            Route::resource('/project', \App\Http\Controllers\Dashboard\Workspace\ProjectController::class)->except('create', 'edit');
            Route::group(['prefix' => 'project', 'as' => 'project.'], function () {
                Route::patch('/{project}/archive', [\App\Http\Controllers\Dashboard\Workspace\ProjectController::class, 'archive'])->name('archive');

                Route::post('/{project}/workflow', [\App\Http\Controllers\Dashboard\Workspace\Project\WorkflowController::class, 'store'])->name('workflow.store');
                Route::patch('/{project}/workflow/{workflow}', [\App\Http\Controllers\Dashboard\Workspace\Project\WorkflowController::class, 'update'])->name('workflow.update');
                Route::patch('/{project}/workflow/{workflow}/reorder', [\App\Http\Controllers\Dashboard\Workspace\Project\WorkflowController::class, 'reorder'])->name('workflow.reorder');
                Route::delete('/{project}/workflow/{workflow}', [\App\Http\Controllers\Dashboard\Workspace\Project\WorkflowController::class, 'destroy'])->name('workflow.destroy');
            });
        });
    });
});

require __DIR__.'/settings.php';
