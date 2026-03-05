import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Task, TaskChecklist } from "@/types";
import { CheckSquare, Plus, X } from "lucide-react";
import { useRef, useState } from "react";

export default function TaskSectionChecklist({
    task,
    onUpdate,
}: {
    task: Task;
    onUpdate: (task: Task) => void;
}) {
    const [showAddChecklist, setShowAddChecklist] = useState(false);
    const [newChecklistText, setNewChecklistText] = useState('');
    const [editingChecklistId, setEditingChecklistId] = useState<string | null>(null);
    const [editingChecklistText, setEditingChecklistText] = useState('');
    const checklistInputRef = useRef<HTMLInputElement>(null);

    const checklists = task.checklist ?? [];
    const checklistDone = checklists.filter((i) => i.is_done).length;
    const checklistPercentage = checklists.length > 0
        ? Math.round((checklistDone / checklists.length) * 100)
        : 0;

    function addChecklistItem() {
        const trimmed = newChecklistText.trim();

        if (!trimmed) return;

        const updated = [
            ...(task.checklist ?? []),
            {
                id: `cl-${Date.now()}`,
                task_id: task.id,
                text: trimmed,
                is_done: false
            },
        ];

        onUpdate({ ...task, checklist: updated });

        setNewChecklistText('');
    }

    function saveChecklistItemEdit(id: string) {
        const trimmed = editingChecklistText.trim();

        if (trimmed) {
            const updated = (task.checklist ?? []).map((item) =>
                item.id === id ? { ...item, text: trimmed } : item,
            );
            onUpdate({ ...task, checklist: updated });
        }

        setEditingChecklistId(null);
    }

    function toggleChecklistItem(id: string) {
        const updated = (task.checklist ?? []).map((item) =>
            item.id === id ? { ...item, is_done: !item.is_done } : item,
        );

        onUpdate({ ...task, checklist: updated });
    }

    function removeChecklistItem(id: string) {
        const updated = (task.checklist ?? []).filter((item) => item.id !== id);

        onUpdate({ ...task, checklist: updated.length > 0 ? updated : undefined });
    }

    return (
        <div>
            <div className="mb-1.5 flex items-center">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <CheckSquare className="h-3.5 w-3.5" />
                    Checklist
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setShowAddChecklist(!showAddChecklist);
                        if (!showAddChecklist) requestAnimationFrame(() => checklistInputRef.current?.focus());
                    }}
                    className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                    {showAddChecklist ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                </button>
            </div>

            {checklists.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="shrink-0 text-right text-[10px] text-muted-foreground tabular-nums">
                            {checklistPercentage}%
                        </span>

                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                                className={cn('h-full rounded-full transition-all duration-300', checklistPercentage === 100 ? 'bg-green-500' : 'bg-primary')}
                                style={{ width: `${checklistPercentage}%` }}
                            />
                        </div>

                        <span className="text-[10px] text-muted-foreground tabular-nums">
                            {checklistDone}/{checklists.length}
                        </span>
                    </div>

                    <div className="space-y-0">
                        {checklists.map((item) => (
                            <div key={item.id} className="group/cl flex items-start gap-2 rounded-md py-1 hover:bg-muted/50">
                                <Checkbox
                                    checked={item.is_done}
                                    onCheckedChange={() => toggleChecklistItem(item.id)}
                                    className="mt-1 shrink-0"
                                />

                                <div className="min-w-0 flex-1">
                                    {
                                        editingChecklistId === item.id
                                            ? (
                                                <input
                                                    autoFocus
                                                    value={editingChecklistText}
                                                    onChange={(e) => setEditingChecklistText(e.target.value)}
                                                    onBlur={() => saveChecklistItemEdit(item.id)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            saveChecklistItemEdit(item.id);
                                                        }

                                                        if (e.key === 'Escape') setEditingChecklistId(null);
                                                    }}
                                                    className="w-full rounded border-0 bg-transparent p-0 text-sm outline-none focus:ring-0"
                                                />
                                            )
                                            : (
                                                <span
                                                    onClick={() => {
                                                        setEditingChecklistId(item.id);
                                                        setEditingChecklistText(item.text);
                                                    }}
                                                    className={cn(
                                                        'cursor-text text-sm leading-snug',
                                                        item.is_done && 'line-through text-muted-foreground',
                                                    )}
                                                >
                                                    {item.text}
                                                </span>
                                            )
                                    }
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeChecklistItem(item.id)}
                                    className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded text-muted-foreground/40 opacity-0 transition-opacity hover:text-destructive group-hover/cl:opacity-100"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showAddChecklist && (
                <div className="mt-2 flex items-center gap-1.5">
                    <input
                        ref={checklistInputRef}
                        value={newChecklistText}
                        onChange={(e) => setNewChecklistText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addChecklistItem();
                            }

                            if (e.key === 'Escape') {
                                setShowAddChecklist(false);
                                setNewChecklistText('');
                            }
                        }}
                        placeholder="Tambah item…"
                        className="min-w-0 flex-1 rounded-md border border-border bg-transparent px-2.5 py-1 text-xs outline-none ring-ring focus:ring-2"
                    />

                    <Button
                        size="sm"
                        className="h-7 px-2.5 text-xs"
                        disabled={!newChecklistText.trim()}
                        onClick={addChecklistItem}
                    >
                        Tambah
                    </Button>
                </div>
            )}
        </div>
    );
}