import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Task } from "@/types";
import { AlignLeft } from "lucide-react";
import { useRef, useState } from "react";

export default function TaskSectionDescription({
    task,
    onUpdate,
}: {
    task: Task;
    onUpdate: (task: Task) => void;
}) {
    const [editingDescription, setEditingDescription] = useState(false);
    const [descriptionDraft, setDescriptionDraft] = useState(task.description ?? '');
    const descriptionRef = useRef<HTMLTextAreaElement>(null);

    function saveDescription() {
        const trimmed = descriptionDraft.trim();

        if (trimmed !== (task.description ?? '')) {
            onUpdate({ ...task, description: trimmed || undefined });
        } else {
            setDescriptionDraft(task.description ?? '');
        }

        setEditingDescription(false);
    }

    return (
        <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <AlignLeft className="h-3.5 w-3.5" />
                Deskripsi
            </div>
            {
                editingDescription
                    ? (
                        <div className="space-y-2">
                            <Textarea
                                ref={descriptionRef}
                                autoFocus
                                value={descriptionDraft}
                                onChange={(e) => setDescriptionDraft(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') { setDescriptionDraft(task.description ?? ''); setEditingDescription(false); }
                                }}
                                placeholder="Tambahkan deskripsi…"
                                className="min-h-20 text-sm"
                            />
                            <div className="flex justify-end gap-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 text-xs"
                                    onClick={() => {
                                        setDescriptionDraft(task.description ?? '');
                                        setEditingDescription(false);
                                    }}
                                >Batal</Button>

                                <Button size="sm" className="h-7 text-xs" onClick={saveDescription}>
                                    Simpan
                                </Button>
                            </div>
                        </div>
                    )
                    : (
                        <button
                            type="button"
                            onClick={() => setEditingDescription(true)}
                            className={cn(
                                'w-full rounded-md px-3 py-2 text-left text-sm transition-colors whitespace-pre',
                                task.description
                                    ? 'text-foreground hover:bg-muted'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80',
                            )}
                        >
                            {task.description || 'Tambahkan deskripsi lebih detail…'}
                        </button>
                    )
            }
        </div>
    );
}