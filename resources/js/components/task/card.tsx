import { cn } from "@/lib/utils";
import type { Task, TaskPriority } from "@/types";
import { AlertTriangle, Clock, MessageSquare, Paperclip } from "lucide-react";
import { useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";

const PRIORITY_DOT: Record<TaskPriority, string> = {
    high: "bg-red-500",
    medium: "bg-amber-400",
    low: "bg-blue-400",
};

function formatEstimate(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}j ${m}m` : `${h}j`;
}

export default function TaskCard({
    task,
    columnId,
    onCardClick,
}: {
    task: Task;
    columnId: string;
    onCardClick?: (task: Task) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: { type: "card", columnId },
    });

    const pointerStart = useRef<{ x: number; y: number } | null>(null);

    const checklistDone = task.checklist?.filter((c) => c.is_done).length ?? 0;
    const checklistTotal = task.checklist?.length ?? 0;
    const checklistPct =
        checklistTotal > 0
            ? Math.round((checklistDone / checklistTotal) * 100)
            : 0;

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
            className={cn(
                "cursor-grab touch-none active:cursor-grabbing",
                isDragging && "opacity-30",
            )}
            {...attributes}
            {...listeners}
            onPointerDown={(e) => {
                pointerStart.current = { x: e.clientX, y: e.clientY };
                listeners?.onPointerDown?.(e as React.PointerEvent);
            }}
            onPointerUp={(e) => {
                if (pointerStart.current) {
                    const dx = Math.abs(e.clientX - pointerStart.current.x);
                    const dy = Math.abs(e.clientY - pointerStart.current.y);
                    if (dx < 5 && dy < 5) {
                        onCardClick?.(task);
                    }
                }
                pointerStart.current = null;
            }}
        >
            <div
                className={cn(
                    "flex flex-col gap-2 rounded-lg border bg-background px-3 py-2.5 shadow-sm",
                    task.is_overdue
                        ? "border-red-400/60 dark:border-red-500/40"
                        : "border-border",
                    task.is_done && "opacity-60",
                )}
            >
                {task.labels && task.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {task.labels.map((label) => (
                            <span
                                key={label.text}
                                className={cn(
                                    "rounded px-1.5 py-0.5 text-[10px] font-medium leading-none",
                                    label.color,
                                )}
                            >
                                {label.text}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex items-start gap-2">
                    <span
                        className={cn(
                            "mt-1 h-1.5 w-1.5 shrink-0 rounded-full",
                            PRIORITY_DOT[task.priority],
                        )}
                    />
                    <p
                        className={cn(
                            "text-xs font-medium leading-snug",
                            task.is_done && "line-through text-muted-foreground",
                        )}
                    >
                        {task.title}
                    </p>
                </div>

                {task.description && (
                    <p className="truncate pl-3.5 text-[10px] leading-snug text-muted-foreground">
                        {task.description}
                    </p>
                )}

                {task.checklist && task.checklist.length > 0 && (
                    <div className="flex flex-col gap-1 pl-3.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground">
                                {checklistDone}/{checklistTotal} sub-tugas
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                                {checklistPct}%
                            </span>
                        </div>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all",
                                    task.is_done ? "bg-green-500" : "bg-primary",
                                )}
                                style={{ width: `${checklistPct}%` }}
                            />
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between gap-2 pl-3.5">
                    <div className="flex items-center gap-2">
                        {task.due_date && (
                            <span
                                className={cn(
                                    "flex items-center gap-0.5 text-[10px]",
                                    task.is_overdue
                                        ? "font-medium text-red-500 dark:text-red-400"
                                        : "text-muted-foreground",
                                )}
                            >
                                {task.is_overdue ? (
                                    <AlertTriangle className="h-2.5 w-2.5" />
                                ) : (
                                    <Clock className="h-2.5 w-2.5" />
                                )}
                                {task.due_date}
                            </span>
                        )}
                        {task.estimate_minutes != null && (
                            <Badge
                                variant="secondary"
                                className="h-4 px-1 text-[10px]"
                            >
                                {formatEstimate(task.estimate_minutes)}
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {!!task.attachments_count && (
                            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                <Paperclip className="h-2.5 w-2.5" />
                                {task.attachments_count}
                            </span>
                        )}
                        {!!task.comments_count && (
                            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                <MessageSquare className="h-2.5 w-2.5" />
                                {task.comments_count}
                            </span>
                        )}
                        {task.assignees && task.assignees.length > 0 && (
                            <div className="flex -space-x-1.5">
                                {task.assignees.map((user) => (
                                    <span
                                        key={user.id}
                                        className="flex h-4 w-4 items-center justify-center rounded-full bg-muted text-[8px] font-semibold ring-1 ring-background"
                                    >
                                        {user.name.slice(0, 2).toUpperCase()}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
