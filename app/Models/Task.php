<?php

namespace App\Models;

use App\Enums\TaskPriorityEnum;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use OwenIt\Auditing\Contracts\Auditable;

class Task extends Model implements Auditable
{
    use HasUuids, SoftDeletes, \OwenIt\Auditing\Auditable;

    public function workflow(): BelongsTo
    {
        return $this->belongsTo(Workflow::class);
    }

    protected $fillable = [
        'workflow_id',
        'position',
        'title',
        'description',
        'priority',
        'due_date',
        'estimate_minutes',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'priority' => TaskPriorityEnum::class,
            'completed_at' => 'datetime',
        ];
    }
}
