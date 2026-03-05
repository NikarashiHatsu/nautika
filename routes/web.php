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
            Route::get('/kanban', \App\Http\Controllers\Dashboard\Workspace\Project\KanbanController::class)->name('kanban.index');

            Route::resource('/project', \App\Http\Controllers\Dashboard\Workspace\ProjectController::class)->except('create', 'edit');
            Route::group(['prefix' => '/project/{project}', 'as' => 'project.'], function () {
                Route::patch('/archive', [\App\Http\Controllers\Dashboard\Workspace\ProjectController::class, 'archive'])->name('archive');

                Route::group(['prefix' => 'workflow', 'as' => 'workflow.'], function () {
                    Route::post('/', [\App\Http\Controllers\Dashboard\Workspace\Project\WorkflowController::class, 'store'])->name('store');
                    Route::patch('/{workflow}', [\App\Http\Controllers\Dashboard\Workspace\Project\WorkflowController::class, 'update'])->name('update');
                    Route::patch('/{workflow}/reorder', [\App\Http\Controllers\Dashboard\Workspace\Project\WorkflowController::class, 'reorder'])->name('reorder');
                    Route::delete('/{workflow}', [\App\Http\Controllers\Dashboard\Workspace\Project\WorkflowController::class, 'destroy'])->name('destroy');

                    Route::resource('/{workflow}/task', \App\Http\Controllers\TaskController::class)->only(['store', 'update', 'destroy']);
                });
            });
        });
    });
});

require __DIR__.'/settings.php';
