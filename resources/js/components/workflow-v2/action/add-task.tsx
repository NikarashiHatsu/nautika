import TaskController from "@/actions/App/Http/Controllers/Api/v1/TaskController";
import { Button } from "@/components/ui/button";
import { PRIORITY_DOT } from "@/constants/priority-dot";
import { cn } from "@/lib/utils";
import { Task, TaskPriority } from "@/types";
import axios from "axios";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function WorkflowV2ActionAddTask({
    workflowId,
    onTaskAdded,
}: {
    workflowId: string;
    onTaskAdded: (task: Task) => void;
}) {
    const [isAdding, setIsAdding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<{
        title: string;
        priority: TaskPriority;
    }>({
        title: '',
        priority: 'medium',
    });

    const taskTextareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async () => {
        if (!formData.title.trim()) return;

        setIsSubmitting(true);

        try {
            const response = await axios.post(TaskController.store.url(), {
                workflow_id: workflowId,
                ...formData,
            });

            onTaskAdded(response.data.task);
            setIsAdding(false);
            resetFormData();

            toast.success('Task added successfully');
        } catch (error) {
            setIsAdding(true);

            toast.error('Failed to add task. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    const resetFormData = () => {
        setFormData({
            title: '',
            priority: 'medium'
        });
    }

    const handleCancel = () => {
        setIsAdding(false);
        resetFormData();
    }

    return (
        <>
            {isAdding
                ? (
                    <div className="flex flex-col gap-2 rounded-lg border border-border bg-background p-2 shadow-sm">
                        <textarea
                            ref={taskTextareaRef}
                            autoFocus
                            rows={2}
                            placeholder="Judul tugas…"
                            value={formData.title}
                            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }

                                if (e.key === 'Escape') handleCancel();
                            }}
                            className="w-full resize-none rounded border-0 bg-transparent px-1 text-xs leading-snug outline-none placeholder:text-muted-foreground/60 focus:ring-0"
                        />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] text-muted-foreground mr-1">
                                    Prioritas:
                                </span>

                                {( ['low', 'medium', 'high'] as const).map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setFormData((prev) => ({ ...prev, priority: p }))}
                                        className={cn(
                                            'h-4 w-4 rounded-full transition-all',
                                            PRIORITY_DOT[p],
                                            formData.priority === p
                                                ? 'scale-110'
                                                : 'border-transparent opacity-50 hover:opacity-80',
                                        )}
                                        title={p.charAt(0).toUpperCase() + p.slice(1)}
                                    />
                                ) )}
                            </div>

                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-[11px]"
                                    onClick={handleCancel}
                                >
                                    Batal
                                </Button>

                                <Button
                                    size="sm"
                                    className="h-6 px-2 text-[11px]"
                                    disabled={!formData.title.trim() || isSubmitting}
                                    onClick={handleSubmit}
                                >
                                    Tambah
                                </Button>
                            </div>
                        </div>
                    </div>
                )
                : (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAdding(true)}
                        className="w-full justify-start gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Tambah tugas
                    </Button>
                )
            }
        </>
    );
}