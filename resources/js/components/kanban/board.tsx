import { Project, Workflow, Workspace } from "@/types";
import KanbanEmptyProject from "./state/empty-project";
import {
    closestCenter,
    closestCorners,
    CollisionDetection,
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { arrayMove, horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import WorkflowColumn from "@/components/workflow/column";
import KanbanColumnCard, { getMockTasks } from "../workflow/container";
import { Task, TaskPriority } from "@/types";
import AddWorkflowAction from "@/components/workflow/action/add-workflow";
import { useCallback, useEffect, useRef, useState } from "react";
import TaskDialog from "../task/task-dialog";
import { router } from "@inertiajs/react";
import WorkflowController from "@/actions/App/Http/Controllers/Dashboard/Workspace/Project/WorkflowController";
import DeleteWorkflowModal from "../workflow/action/delete-workflow-modal";
import { WorkflowProvider } from "@/components/workflow/provider/workflow-provider";
import TaskCard from "../task/card";

export default function KanbanBoard({
    projects,
    workspace,
    workflows: workflowsProp,
    selectedProject,
}: {
    projects: Project[];
    workspace: Workspace;
    workflows: Workflow[];
    selectedProject: Project | null;
}) {
    const [columns, setColumns] = useState<Workflow[]>(
        () => [...(workflowsProp ?? [])].sort((a, b) => a.position - b.position),
    );
    useEffect(() => {
        setColumns([...(workflowsProp ?? [])].sort((a, b) => a.position - b.position));
    }, [workflowsProp]);

    const [activeId, setActiveId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<Workflow | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    );

    const handleEditStart = useCallback((workflow: Workflow) => {
        setEditingId(workflow.id);
        setEditingName(workflow.name);
    }, []);

    const handleEditSave = useCallback(() => {
        if (!editingId) return;
        const trimmed = editingName.trim();
        setEditingId(null);
        setEditingName("");
        if (!trimmed) return;
        const original = columns.find((c) => c.id === editingId);
        if (!original || trimmed === original.name) return;
        setColumns((prev) =>
            prev.map((c) => (c.id === editingId ? { ...c, name: trimmed } : c)),
        );
        if (!selectedProject) return;
        router.patch(
            WorkflowController.update.url({
                workspace,
                project: selectedProject,
                workflow: editingId,
            }),
            { name: trimmed },
            { preserveScroll: true, preserveState: true },
        );
    }, [editingId, editingName, columns, workspace, selectedProject]);

    const handleEditCancel = useCallback(() => {
        setEditingId(null);
        setEditingName("");
    }, []);

    const handleStartDeleteWorkflow = useCallback((workflow: Workflow) => {
        setDeleteTarget(workflow);
    }, []);

    const handleAddWorkflow = useCallback(
        (name: string) => {
            if (!selectedProject) return;
            router.post(
                WorkflowController.store.url({ workspace, project: selectedProject }),
                { name },
                { preserveScroll: true },
            );
        },
        [workspace, selectedProject],
    );

    const handleDragStart = useCallback((event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    }, []);

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            setActiveId(null);
            const { active, over } = event;
            if (!over || active.id === over.id) return;
            setColumns((prev) => {
                const oldIndex = prev.findIndex((c) => c.id === active.id);
                const newIndex = prev.findIndex((c) => c.id === over.id);
                const reordered = arrayMove(prev, oldIndex, newIndex);
                if (selectedProject) {
                    router.patch(
                        WorkflowController.reorder.url({
                            workspace,
                            project: selectedProject,
                            workflow: active.id as string,
                        }),
                        {
                            workflows: reordered.map((c, i) => ({
                                id: c.id,
                                position: i,
                            })),
                        },
                        { preserveScroll: true, preserveState: true },
                    );
                }
                return reordered;
            });
        },
        [workspace, selectedProject],
    );

    const activeWorkflow =
        activeId ? columns.find((c) => c.id === activeId) ?? null : null;

    const [cardsByColumn, setCardsByColumn] = useState<Record<string, Task[]>>({});
    const [activeCard, setActiveCard] = useState<Task | null>(null);
    const activeCardColumnRef = useRef<string | null>(null);

    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);

    useEffect(() => {
        setCardsByColumn((prev) => {
            const next: Record<string, Task[]> = {};
            for (const wf of columns) {
                next[wf.id] = prev[wf.id] ?? getMockTasks(wf);
            }
            return next;
        });
    }, [columns]);

    const collisionDetection: CollisionDetection = useCallback(
        (args) => {
            if (activeCard) {
                // Card drag: only collide with other cards and column droppable zones
                const filtered = args.droppableContainers.filter((c) => {
                    const type = c.data.current?.type as string | undefined;
                    return type === 'card' || type === 'column-droppable';
                });
                return closestCorners({ ...args, droppableContainers: filtered });
            }

            // Column drag: only collide with other columns
            const filtered = args.droppableContainers.filter(
                (c) => c.data.current?.type === 'column',
            );
            return closestCenter({ ...args, droppableContainers: filtered });
        },
        [activeCard],
    );

    const onDragStart = useCallback(
        (event: DragStartEvent) => {
            if (event.active.data.current?.type === 'card') {
                const columnId = event.active.data.current.columnId as string;
                activeCardColumnRef.current = columnId;
                const card = cardsByColumn[columnId]?.find(
                    (t) => t.id === event.active.id,
                );
                setActiveCard(card ?? null);
            } else {
                handleDragStart(event);
            }
        },
        [cardsByColumn, handleDragStart],
    );

    const onDragOver = useCallback(
        (event: DragOverEvent) => {
            const { active, over } = event;
            if (!over || active.data.current?.type !== 'card') return;

            const activeId    = active.id as string;
            const overId      = over.id as string;
            const activeColId = activeCardColumnRef.current;
            if (!activeColId) return;

            const overType  = over.data.current?.type as string | undefined;
            const overColId = over.data.current?.columnId as string | undefined;
            if (!overColId) return;

            setCardsByColumn((prev) => {
                const sourceItems = [...(prev[activeColId] ?? [])];
                const activeIdx   = sourceItems.findIndex((t) => t.id === activeId);
                if (activeIdx === -1) return prev;

                if (activeColId === overColId) {
                    if (overType !== 'card') return prev;
                    const overIdx = sourceItems.findIndex((t) => t.id === overId);
                    if (overIdx === -1 || activeIdx === overIdx) return prev;
                    return { ...prev, [activeColId]: arrayMove(sourceItems, activeIdx, overIdx) };
                }

                const destItems   = [...(prev[overColId] ?? [])];
                const [movedCard] = sourceItems.splice(activeIdx, 1);
                const insertIdx   = overType === 'card'
                    ? destItems.findIndex((t) => t.id === overId)
                    : destItems.length;
                destItems.splice(insertIdx >= 0 ? insertIdx : destItems.length, 0, movedCard);

                activeCardColumnRef.current = overColId;

                return {
                    ...prev,
                    [activeColId]: sourceItems,
                    [overColId]:   destItems,
                };
            });
        },
        [],
    );

    const handleCardClick = useCallback(
        (task: Task) => {
            const colId = Object.entries(cardsByColumn).find(
                ([, tasks]) => tasks.some((t) => t.id === task.id),
            )?.[0] ?? null;
            setSelectedTask(task);
            setSelectedColumnId(colId);
        },
        [cardsByColumn],
    );

    const handleUpdateTask = useCallback(
        (updated: Task) => {
            setSelectedTask(updated);
            setCardsByColumn((prev) => {
                const next: Record<string, Task[]> = {};
                for (const [colId, tasks] of Object.entries(prev)) {
                    next[colId] = tasks.map((t) => (t.id === updated.id ? updated : t));
                }
                return next;
            });
        },
        [],
    );

    const handleAddTask = useCallback(
        (columnId: string, title: string, priority: TaskPriority) => {
            const newTask: Task = {
                id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                workflow_id: columnId,
                position: 0,
                title,
                priority,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            setCardsByColumn((prev) => ({
                ...prev,
                [columnId]: [...(prev[columnId] ?? []), newTask],
            }));
        },
        [],
    );

    const onDragEnd = useCallback(
        (event: DragEndEvent) => {
            if (event.active.data.current?.type === 'card') {
                setActiveCard(null);
                activeCardColumnRef.current = null;
            } else {
                handleDragEnd(event);
            }
        },
        [handleDragEnd],
    );

    if (projects.length === 0) return <KanbanEmptyProject workspace={workspace} />;

    return (
        <>
            {selectedProject && (
                <DeleteWorkflowModal
                    workspace={workspace}
                    project={selectedProject}
                    workflow={deleteTarget}
                    open={!!deleteTarget}
                    onOpenChange={(o) => {
                        if (!o) setDeleteTarget(null);
                    }}
                />
            )}

            <WorkflowProvider
                value={{
                    editingId,
                    editingName,
                    onEditStart: handleEditStart,
                    onEditChange: setEditingName,
                    onEditSave: handleEditSave,
                    onEditCancel: handleEditCancel,
                    onDeleteStart: handleStartDeleteWorkflow,
                    onAddTask: handleAddTask,
                    onCardClick: handleCardClick,
                }}
            >
                <DndContext
                    sensors={sensors}
                    collisionDetection={collisionDetection}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragEnd={onDragEnd}
                >
                    <SortableContext
                        items={columns.map((c) => c.id)}
                        strategy={horizontalListSortingStrategy}
                    >
                        <div className="flex flex-1 items-start gap-3 overflow-x-auto pb-2">
                            {columns.map((workflow) => (
                                <WorkflowColumn
                                    key={workflow.id}
                                    workflow={workflow}
                                    tasks={cardsByColumn[workflow.id] ?? []}
                                />
                            ))}

                            <AddWorkflowAction onAdd={handleAddWorkflow} />
                        </div>
                    </SortableContext>

                    <DragOverlay>
                        {activeWorkflow && !activeCard && (
                            <div className="rotate-1 shadow-2xl">
                                <KanbanColumnCard
                                    workflow={activeWorkflow}
                                    tasks={cardsByColumn[activeWorkflow.id] ?? []}
                                    editing={false}
                                />
                            </div>
                        )}

                        {activeCard && (
                            <div className="w-72 rotate-1 shadow-2xl">
                                <TaskCard
                                    task={activeCard}
                                    columnId={activeCardColumnRef.current ?? ''}
                                    onCardClick={handleCardClick}
                                />
                            </div>
                        )}
                    </DragOverlay>
                </DndContext>
            </WorkflowProvider>

            {selectedTask && (
                <TaskDialog
                    task={selectedTask}
                    columnName={
                        selectedColumnId
                            ? columns.find((w) => String(w.id) === String(selectedColumnId))?.name
                            : undefined
                    }
                    open={!!selectedTask}
                    onOpenChange={(open) => {
                        if (!open) setSelectedTask(null);
                    }}
                    onUpdate={handleUpdateTask}
                />
            )}
        </>
    );
}
