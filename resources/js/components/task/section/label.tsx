import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Task, TaskLabel } from "@/types";
import { Check, Plus, Tag, X } from "lucide-react";
import { useRef, useState } from "react";

const PRESET_LABELS: TaskLabel[] = [
    { text: 'Bug',      color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
    { text: 'Frontend', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    { text: 'Backend',  color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
    { text: 'UI/UX',    color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300' },
    { text: 'DevOps',   color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
    { text: 'Docs',     color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    { text: 'Riset',    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
    { text: 'Critical', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
];

const CUSTOM_LABEL_COLORS = [
    'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
    'bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300',
    'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
];

export default function TaskSectionLabel({
    task,
    onUpdate,
}: {
    task: Task;
    onUpdate: (task: Task) => void;
}) {
    const [showLabelPicker, setShowLabelPicker] = useState(false);
    const labelInputRef = useRef<HTMLInputElement>(null);
    const [newLabelText, setNewLabelText] = useState('');

    function addCustomLabel() {
        const trimmed = newLabelText.trim();

        if (!trimmed) return;

        const current = task.labels ?? [];

        if (current.some((l) => l.text.toLowerCase() === trimmed.toLowerCase())) {
            setNewLabelText('');
            return;
        }

        const color = CUSTOM_LABEL_COLORS[current.length % CUSTOM_LABEL_COLORS.length];

        onUpdate({ ...task, labels: [...current, { text: trimmed, color }] });

        setNewLabelText('');
    }

    function removeLabel(text: string) {
        const updated = (task.labels ?? []).filter((l) => l.text !== text);

        onUpdate({ ...task, labels: updated.length > 0 ? updated : undefined });
    }

    function togglePresetLabel(preset: TaskLabel) {
        const current = task.labels ?? [];

        const exists  = current.some((l) => l.text === preset.text);

        if (exists) {
            const updated = current.filter((l) => l.text !== preset.text);
            onUpdate({ ...task, labels: updated.length > 0 ? updated : undefined });
        } else {
            onUpdate({ ...task, labels: [...current, preset] });
        }
    }

    return (
        <div>
            <div className="mb-1.5 flex items-center">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" />
                    Label
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setShowLabelPicker(!showLabelPicker);
                        if (!showLabelPicker) requestAnimationFrame(() => labelInputRef.current?.focus());
                    }}
                    className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                    {
                        showLabelPicker
                            ? <X className="h-3.5 w-3.5" />
                            : <Plus className="h-3.5 w-3.5" />
                    }
                </button>
            </div>

            {task.labels && task.labels.length > 0 && (
                <div className="flex flex-wrap gap-1.5 ml-5">
                    {task.labels.map((label) => (
                        <span
                            key={label.text}
                            className={
                                cn('group/label flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium',
                                label.color
                            )}
                        >
                            {label.text}

                            <button
                                type="button"
                                onClick={() => removeLabel(label.text)}
                                className="flex h-3.5 w-3.5 items-center justify-center rounded-full opacity-0 transition-opacity group-hover/label:opacity-100 hover:bg-black/10 dark:hover:bg-white/10"
                            >
                                <X className="h-2.5 w-2.5" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {showLabelPicker && (
                <div className="mt-2 ml-5 rounded-lg border border-border bg-background p-3 shadow-sm space-y-3">
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Pilih label
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                            {PRESET_LABELS.map((preset) => {
                                const active = (task.labels ?? []).some((l) => l.text === preset.text);

                                return (
                                    <button
                                        key={preset.text}
                                        type="button"
                                        onClick={() => togglePresetLabel(preset)}
                                        className={cn(
                                            'flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                                            preset.color,
                                            active ? 'ring-1 ring-primary ring-offset-1 ring-offset-background' : 'opacity-60 hover:opacity-100',
                                        )}
                                    >
                                        {active && <Check className="h-3 w-3" />}
                                        {preset.text}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-1.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Label baru
                        </p>

                        <div className="flex gap-1.5">
                            <input
                                ref={labelInputRef}
                                value={newLabelText}
                                onChange={(e) => setNewLabelText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addCustomLabel();
                                    }

                                    if (e.key === 'Escape') {
                                        setShowLabelPicker(false);
                                        setNewLabelText('');
                                    }
                                }}
                                placeholder="Nama label…"
                                className="min-w-0 flex-1 rounded-md border border-border bg-transparent px-2.5 py-1 text-xs outline-none ring-ring focus:ring-2"
                            />

                            <Button
                                size="sm"
                                className="h-7 px-2.5 text-xs"
                                disabled={!newLabelText.trim()}
                                onClick={addCustomLabel}
                            >
                                Tambah
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}