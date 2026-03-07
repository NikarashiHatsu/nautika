import ProjectController from "@/actions/App/Http/Controllers/Api/v1/ProjectController";
import { Project, Task, Workflow } from "@/types";
import { useEffect, useState } from "react";
import WorkflowV2Container from "../workflow-v2/container";
import TaskV2Dialog from "../task-v2/dialog";
import WorkflowController from "@/actions/App/Http/Controllers/Api/v1/WorkflowController";

export default function KanbanBoardV2({
    project,
}: {
    project: Project;
}) {
    // Project Functionalities
    const [workflows, setWorkflows] = useState<Workflow[]>([]);

    useEffect(() => {
        fetch(ProjectController.workflows.url({ project: project.id }))
            .then((response) => response.json())
            .then((data) => setWorkflows(data.workflows));
    }, [project.id]);

    // Workflow Functionalities
    const [tasksByWorkflow, setTasksByWorkflow] = useState<Record<string, Task[]>>({});

    useEffect(() => {
        workflows.forEach((workflow) => {
            fetch(WorkflowController.tasks.url({ workflow: workflow.id }))
                .then((response) => response.json())
                .then((data) => setTasksByWorkflow((prev) => ({ ...prev, [workflow.id]: data.tasks })));
        });
    }, [workflows]);

    // Task Dialog
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [taskDialogOpened, setTaskDialogOpened] = useState(false);

    const handleTaskClicked = (task: Task) => {
        setSelectedTask(task);
        setTaskDialogOpened(true);
    }

    const handleTaskAdded = (newTask: Task) => {
        setTasksByWorkflow((prev) => ({
            ...prev,
            [newTask.workflow_id]: [...(prev[newTask.workflow_id] ?? []), newTask],
        }));
    }

    const handleTaskUpdated = (updatedTask: Task) => {
        setTasksByWorkflow((prev) => ({
            ...prev,
            [updatedTask.workflow_id]: prev[updatedTask.workflow_id]?.map((t) =>
                t.id === updatedTask.id ? updatedTask : t
            ) ?? [],
        }));
    }

    return (
        <>
            <div className="flex flex-1 items-start gap-3 overflow-x-auto pb-2">
                {workflows.map((workflow) => (
                    <WorkflowV2Container
                        key={workflow.id}
                        workflow={workflow}
                        tasks={tasksByWorkflow[workflow.id] ?? []}
                        onTaskClicked={handleTaskClicked}
                        onTaskAdded={handleTaskAdded}
                    />
                ))}
            </div>

            {selectedTask && (
                <TaskV2Dialog
                    task={selectedTask}
                    open={taskDialogOpened}
                    onTaskDialogOpened={setTaskDialogOpened}
                    onTaskUpdated={handleTaskUpdated}
                />
            )}
        </>
    );
}