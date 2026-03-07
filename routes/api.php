<?php

use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'v1', 'as' => 'api.'], function () {
    Route::get('/project/{project}/workflows', [\App\Http\Controllers\Api\v1\ProjectController::class, 'workflows'])->name('project.workflows');

    Route::get('/workflow/{workflow}/tasks', [\App\Http\Controllers\Api\v1\WorkflowController::class, 'tasks'])->name('workflow.tasks');

    Route::post('/task', [\App\Http\Controllers\Api\v1\TaskController::class, 'store'])->name('task.store');
    Route::patch('/task/{task}/update-title', [\App\Http\Controllers\Api\v1\TaskController::class, 'update_title'])->name('task.update-title');
});