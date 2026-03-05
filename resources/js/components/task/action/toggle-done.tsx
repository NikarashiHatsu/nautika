import { cn } from "@/lib/utils";
import { Task } from "@/types";
import { CheckSquare } from "lucide-react";

export default function TaskActionToggleDone({
    task,
    toggleDone,
}: {
    task: Task;
    toggleDone: () => void;
}) {
    return (
        <button
            type="button"
            onClick={toggleDone}
            className={cn(
                'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                task.is_done
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80',
            )}
        >
            <CheckSquare className="h-3.5 w-3.5" />
            {task.is_done ? 'Selesai' : 'Tandai selesai'}
        </button>
    );
}