import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Task } from "@/types";
import { TaskPriority } from "@/types/task-priority";
import { Check, Signal } from "lucide-react";

const PRIORITY_CONFIG: Record<TaskPriority, {
    label: string;
    dot: string;
    bg: string;
    icon: string
}> = {
    high: {
        label: 'Tinggi',
        dot: 'bg-red-500',
        bg: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
        icon: 'text-red-600 dark:text-red-400'
    },
    medium: {
        label: 'Sedang',
        dot: 'bg-amber-400',
        bg: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
        icon: 'text-amber-600 dark:text-amber-400'
    },
    low: {
        label: 'Rendah',
        dot: 'bg-blue-400',
        bg: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
        icon: 'text-blue-600 dark:text-blue-400'
    }
};

export default function TaskActionPriority({
    task,
    onUpdate,
}: {
    task: Task;
    onUpdate: (task: Task) => void;
}) {
    const prio = PRIORITY_CONFIG[task.priority];

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors',
                        prio.bg,
                    )}
                >
                    <Signal className={cn('h-3.5 w-3.5 shrink-0', prio.icon)} />
                    <span className="flex items-center gap-1.5">
                        <span className={cn('h-2 w-2 rounded-full', prio.dot)} />
                        {prio.label}
                    </span>
                </button>
            </PopoverTrigger>

            <PopoverContent align="start" className="w-40 p-1.5">
                <p className="mb-1 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Prioritas
                </p>

                <div className="space-y-0.5">
                    {(Object.entries(PRIORITY_CONFIG) as [TaskPriority, typeof prio][]).map(([key, cfg]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onUpdate({ ...task, priority: key })}
                            className={cn(
                                'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors',
                                task.priority === key ? cfg.bg : 'hover:bg-muted',
                            )}
                        >
                            <span className={cn('h-2 w-2 rounded-full', cfg.dot)} />

                            <span className="flex-1 text-left">
                                {cfg.label}
                            </span>

                            {task.priority === key && <Check className="h-3 w-3" />}
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}