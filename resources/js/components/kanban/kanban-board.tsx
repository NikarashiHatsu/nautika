import { Project, Workflow, Workspace } from "@/types";
import KanbanEmptyProject from "./kanban-empty-project";
import { closestCenter, DndContext, DragEndEvent, DragOverlay, DragStartEvent, SensorDescriptor, SensorOptions } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import KanbanSortableColumn from "./kanban-sortable-column";
import KanbanColumnCard from "./kanban-column-card";
import KanbanAddColumn from "./kanban-add-column";

export default function KanbanBoard({
    projects,
    workspace,
    workflows,
    sensors,
    handleDragStart,
    handleDragEnd,
    editingId,
    editingName,
    handleEditStart,
    setEditingName,
    handleEditSave,
    handleEditCancel,
    handleDeleteStart,
    handleAddColumn,
    activeColumn,
}: {
    projects: Project[];
    workspace: Workspace;
    workflows: Workflow[];
    sensors: SensorDescriptor<SensorOptions>[];
    handleDragStart: (event: DragStartEvent) => void;
    handleDragEnd: (event: DragEndEvent) => void;
    editingId: string | null;
    editingName: string;
    handleEditStart: (workflow: Workflow) => void;
    setEditingName: (value: string) => void;
    handleEditSave: () => void;
    handleEditCancel: () => void;
    handleDeleteStart: (workflow: Workflow) => void;
    handleAddColumn: (name: string) => void;
    activeColumn: Workflow | null;
}) {
    if (projects.length === 0) return <KanbanEmptyProject workspace={workspace} />;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={workflows.map((c) => c.id)}
                strategy={horizontalListSortingStrategy}
            >
                <div className="flex flex-1 items-start gap-3 overflow-x-auto pb-2">
                    {workflows.map((workflow) => (
                        <KanbanSortableColumn
                            key={workflow.id}
                            workflow={workflow}
                            editingId={editingId}
                            editingName={editingName}
                            onEditStart={handleEditStart}
                            onEditChange={setEditingName}
                            onEditSave={handleEditSave}
                            onEditCancel={handleEditCancel}
                            onDeleteStart={handleDeleteStart}
                        />
                    ))}

                    <KanbanAddColumn onAdd={handleAddColumn} />
                </div>
            </SortableContext>

            <DragOverlay>
                {activeColumn && (
                    <div className="rotate-1 shadow-2xl">
                        <KanbanColumnCard workflow={activeColumn} />
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
}