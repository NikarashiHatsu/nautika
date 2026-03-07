import { Task, Workflow } from "@/types";
import { CheckCircle2, Circle, GripVertical, Inbox, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import WorkflowV2ActionAddTask from "./action/add-task";
import TaskV2Card from "../task-v2/card";

export default function WorkflowV2Container({
    workflow,
    tasks,
    onTaskClicked,
    onTaskAdded,
}: {
    workflow: Workflow;
    tasks: Task[];
    onTaskClicked: (task: Task) => void;
    onTaskAdded: (task: Task) => void;
}) {
    return (
        <div className="flex w-72 shrink-0 flex-col rounded-xl border bg-muted/40 transition-shadow">
            <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                    {workflow.is_done ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                    ) : workflow.is_backlog ? (
                        <Inbox className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                        <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}

                    <button
                        type="button"
                        className="min-w-0 truncate text-left text-sm font-medium hover:opacity-70"
                    >
                        {workflow.name}
                    </button>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <Badge variant="secondary" className="tabular-nums">
                        {tasks.length}
                    </Badge>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground/50 hover:text-muted-foreground"
                                title="Opsi kolom"
                            >
                                <MoreHorizontal className="h-3.5 w-3.5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Trash2 className="h-4 w-4" />
                                Hapus kolom
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div
                        className="flex h-5 w-5 cursor-grab items-center justify-center rounded text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing"
                        title="Seret untuk mengubah urutan"
                    >
                        <GripVertical className="h-3.5 w-3.5" />
                    </div>
                </div>
            </div>


            <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2 min-h-48 transition-colors">
                { tasks.map(task => (
                    <TaskV2Card
                        key={task.id}
                        task={task}
                        onTaskClicked={onTaskClicked}
                    />
                ))}
            </div>

            <div className="p-2 pt-0">
                <WorkflowV2ActionAddTask
                    workflowId={workflow.id}
                    onTaskAdded={onTaskAdded}
                />
            </div>
        </div>
    );
}