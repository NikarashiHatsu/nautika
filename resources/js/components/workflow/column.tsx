import type { Task, Workflow } from "@/types";
import { useWorkflowContext } from "./provider/workflow-provider";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import WorkflowContainer from "./container";

export default function WorkflowColumn({
    workflow,
    tasks,
}: {
    workflow: Workflow;
    tasks: Task[];
}) {
    const ctx = useWorkflowContext();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: workflow.id,
        disabled: ctx?.editingId === workflow.id,
        data: { type: 'column' },
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <WorkflowContainer
                workflow={workflow}
                tasks={tasks}
                isDragging={isDragging}
                dragHandleProps={{ ...attributes, ...listeners }}
            />
        </div>
    );
}