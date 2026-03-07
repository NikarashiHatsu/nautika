import { Task } from "@/types";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { X } from "lucide-react";
import TaskV2SectionTitle from "./section/title";
import { useState } from "react";
// import TaskActionPriority from "./action/priority";
// import TaskActionAssignee from "./action/assignee";
// import TaskActionDueDate from "./action/due-date";
// import TaskActionEstimate from "./action/estimate";
// import TaskSectionTitle from "./section/title";
// import TaskSectionLabel from "./section/label";
// import TaskSectionDescription from "./section/description";
// import TaskSectionChecklist from "./section/checklist";
// import TaskSectionAttachment from "./section/attachment";
// import TaskSectionComment from "./section/comment";
// import TaskActionToggleDone from "./action/toggle-done";

export default function TaskV2Dialog({
    task: initialTask,
    open,
    onTaskDialogOpened,
    onTaskUpdated,
}: {
    task: Task;
    open: boolean;
    onTaskDialogOpened: (open: boolean) => void;
    onTaskUpdated: (updated: Task) => void;
}) {
    // function toggleDone() {
    //     onUpdate({
    //         ...task,
    //         is_done: !task.is_done
    //     });
    // }

    const [task, setTask] = useState<Task>(initialTask);

    const handleTaskUpdated = (updatedTask: Task) => {
        setTask(updatedTask);
        onTaskUpdated(updatedTask);
    }

    return (
        <Dialog
            open={open}
            onOpenChange={onTaskDialogOpened}
        >
            <DialogContent
                showCloseButton={false}
                className="sm:max-w-4xl gap-0 p-0"
            >
                <div className="flex flex-col gap-0 p-5 pb-0">
                    <DialogTitle className="sr-only">
                        {task.title}
                    </DialogTitle>

                    <DialogDescription className="sr-only">
                        Detail tugas
                    </DialogDescription>

                    <div className="flex items-start gap-3">
                        <Checkbox
                            checked={task.is_done ?? false}
                            // onCheckedChange={toggleDone}
                            className="mt-1 shrink-0"
                        />

                        <TaskV2SectionTitle
                            task={task}
                            onTaskUpdated={handleTaskUpdated}
                        />

                        <button
                            type="button"
                            onClick={() => onTaskDialogOpened(false)}
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground/60 hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 p-5 pt-4 overflow-auto max-h-[calc(90dvh-2rem)]">
                    <div className="min-w-0 flex-1 space-y-6">
                        {/* <TaskSectionLabel task={task} onUpdate={onUpdate} />
                        <TaskSectionDescription task={task} onUpdate={onUpdate} />
                        <TaskSectionChecklist task={task} onUpdate={onUpdate} />
                        <TaskSectionAttachment task={task} onUpdate={onUpdate} />
                        <TaskSectionComment task={task} onUpdate={onUpdate} /> */}
                    </div>

                    <div className="sm:w-52 shrink-0 space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Aksi
                        </p>
                        {/* <TaskActionPriority task={task} onUpdate={onUpdate} />
                        <TaskActionAssignee task={task} onUpdate={onUpdate} />
                        <TaskActionDueDate task={task} onUpdate={onUpdate} />
                        <TaskActionEstimate task={task} onUpdate={onUpdate} />
                        <TaskActionToggleDone task={task} toggleDone={toggleDone} /> */}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
