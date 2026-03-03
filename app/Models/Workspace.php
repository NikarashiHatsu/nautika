<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Workspace extends Model
{
    use HasUuids, SoftDeletes;

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id', 'id');
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    protected $fillable = [
        'name',
        'slug',
        'owner_id',
        'description',
        'settings',
    ];

    protected function casts(): array
    {
        return [
            'settings' => 'json',
        ];
    }
}
