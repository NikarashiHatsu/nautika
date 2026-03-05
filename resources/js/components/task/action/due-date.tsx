import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Task } from "@/types";
import { AlertTriangle, CalendarIcon } from "lucide-react";

export default function TaskActionDueDate({
    task,
    onUpdate,
}: {
    task: Task;
    onUpdate: (task: Task) => void;
}) {
    function parseDueDate(due: string | undefined): Date | undefined {
        if (!due) return undefined;

        const d = new Date(`${due} ${new Date().getFullYear()}`);

        return isNaN(d.getTime()) ? undefined : d;
    }

    function formatDueDate(date: Date): string {
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short'
        });
    }

    function checkOverdue(date: Date): boolean {
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        return date < today;
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors',
                        task.due_date && task.is_overdue
                            ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-900/60'
                            : 'bg-muted hover:bg-muted/80',
                    )}
                >
                    {task.due_date && task.is_overdue
                        ? <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        : <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    }

                    {task.due_date
                        ? <span>{task.due_date}</span>
                        : <span className="text-muted-foreground">Tambah tenggat waktu</span>
                    }
                </button>
            </PopoverTrigger>

            <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={parseDueDate(task.due_date)}
                    onSelect={(date) => {
                        if (!date) return;
                        onUpdate({
                            ...task,
                            due_date: formatDueDate(date),
                            is_overdue: checkOverdue(date)
                        });
                    }}
                />

                {task.due_date && (
                    <div className="border-t p-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full h-7 text-xs text-muted-foreground"
                            onClick={() => onUpdate({ ...task, due_date: undefined, is_overdue: undefined })}
                        >
                            Hapus tenggat waktu
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}