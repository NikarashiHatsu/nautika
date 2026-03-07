import { cn } from "@/lib/utils";
import { Task } from "@/types";
import { useRef, useState } from "react";
import axios from "axios";
import TaskController from "@/actions/App/Http/Controllers/Api/v1/TaskController";
import { toast } from "sonner";

export default function TaskV2SectionTitle({
    task,
    onTaskUpdated,
}: {
    task: Task;
    onTaskUpdated: (updatedTask: Task) => void;
}) {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleDraft, setTitleDraft] = useState(task.title);
    const titleRef = useRef<HTMLTextAreaElement>(null);

    const updateTitle = async (newTitle: string) => {
        await axios.patch(
                TaskController.update_title.url({ task: task.id }),
                {
                    title: newTitle,
                }
            )
            .then((response) => {
                toast.success(response.data.message);
                onTaskUpdated(response.data.task);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    }

    function saveTitle() {
        const trimmedTitle = titleDraft.trim();

        if (trimmedTitle && trimmedTitle !== task.title) {
            updateTitle(trimmedTitle);
        } else {
            setTitleDraft(task.title);
        }

        setIsEditingTitle(false);
    }

    return (
        <div className="min-w-0 flex-1">
            { isEditingTitle
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
                                setIsEditingTitle(false);
                            }
                        }}
                        className="w-full resize-none rounded border-0 bg-transparent p-0 text-base font-semibold leading-snug outline-none focus:ring-0"
                    />
                )
                : (
                    <button
                        type="button"
                        onClick={() => {
                            setIsEditingTitle(true);
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
        </div>
    );
}