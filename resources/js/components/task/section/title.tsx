import { cn } from "@/lib/utils";
import { Task } from "@/types";
import { useRef, useState } from "react";

export default function TaskSectionTitle({
    task,
    columnName,
    onUpdate,
}: {
    task: Task;
    columnName: string | undefined;
    onUpdate: (task: Task) => void;
}) {
    const [editingTitle, setEditingTitle]   = useState(false);
    const [titleDraft, setTitleDraft] = useState(task.title);
    const titleRef = useRef<HTMLTextAreaElement>(null);

    function saveTitle() {
        const trimmed = titleDraft.trim();

        if (trimmed && trimmed !== task.title) {
            onUpdate({ ...task, title: trimmed });
        } else {
            setTitleDraft(task.title);
        }

        setEditingTitle(false);
    }

    return (
        <div className="min-w-0 flex-1">
            { editingTitle
                ? (
                    <textarea
                        ref={titleRef}
                        autoFocus
                        rows={1}
                        value={titleDraft}
                        onChange={(e) => setTitleDraft(e.target.value)}
                        onBlur={saveTitle}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                saveTitle();
                            }

                            if (e.key === 'Escape') {
                                setTitleDraft(task.title);
                                setEditingTitle(false);
                            }
                        }}
                        className="w-full resize-none rounded border-0 bg-transparent p-0 text-base font-semibold leading-snug outline-none focus:ring-0"
                    />
                )
                : (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingTitle(true);
                            requestAnimationFrame(() => titleRef.current?.focus());
                        }}
                        className={cn(
                            'w-full text-left text-base font-semibold leading-snug hover:opacity-70',
                            task.is_done && 'line-through text-muted-foreground',
                        )}
                    >
                        {task.title}
                    </button>
                )
            }

            {columnName && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                    di kolom <span className="font-medium">{columnName}</span>
                </p>
            )}
        </div>
    );
}