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
    });
});

require __DIR__.'/settings.php';
