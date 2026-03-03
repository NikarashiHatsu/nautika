import { Workflow } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import KanbanColumnCard from "./kanban-column-card";

export default function KanbanSortableColumn({
    workflow,
    editingId,
    editingName,
    onEditStart,
    onEditChange,
    onEditSave,
    onEditCancel,
    onDeleteStart,
}: {
    workflow: Workflow;
    editingId: string | null;
    editingName: string;
    onEditStart: (workflow: Workflow) => void;
    onEditChange: (value: string) => void;
    onEditSave: () => void;
    onEditCancel: () => void;
    onDeleteStart: (workflow: Workflow) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: workflow.id,
        disabled: editingId === workflow.id,
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style}>
            <KanbanColumnCard
                workflow={workflow}
                isDragging={isDragging}
                dragHandleProps={{ ...attributes, ...listeners }}
                editing={editingId === workflow.id}
                editValue={editingName}
                onEditStart={() => onEditStart(workflow)}
                onEditChange={onEditChange}
                onEditSave={onEditSave}
                onEditCancel={onEditCancel}
                onDeleteStart={() => onDeleteStart(workflow)}
            />
        </div>
    );
}