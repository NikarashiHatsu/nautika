import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, Project, Workflow, Workspace } from '@/types';
import WorkspaceController from '@/actions/App/Http/Controllers/Dashboard/WorkspaceController';
import KanbanController from '@/actions/App/Http/Controllers/Dashboard/Workspace/Project/KanbanController';
import WorkflowController from '@/actions/App/Http/Controllers/Dashboard/Workspace/Project/WorkflowController';
import { router, usePage } from '@inertiajs/react';
import { useMemo, useCallback, useState, useEffect } from 'react';
import {
    DragEndEvent,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
} from '@dnd-kit/sortable';
import KanbanToolbar from '@/components/kanban/kanban-toolbar';
import KanbanBoard from '@/components/kanban/kanban-board';
import DeleteWorkflowModal from '@/components/kanban/delete-workflow-modal';

type KanbanViewProps = {
    workspace: Workspace;
    projects: Project[];
    selectedProject: Project | null;
    workflows: Workflow[];
};

export default function KanbanView() {
    const {
        workspace,
        projects,
        selectedProject,
        workflows
    } = usePage().props as unknown as KanbanViewProps;

    const [columns, setColumns] = useState<Workflow[]>(
        () => [...(workflows ?? [])].sort((a, b) => a.position - b.position),
    );

    useEffect(() => {
        setColumns([...(workflows ?? [])].sort((a, b) => a.position - b.position));
    }, [workflows]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<Workflow | null>(null);

    const handleEditStart = useCallback((workflow: Workflow) => {
        setEditingId(workflow.id);
        setEditingName(workflow.name);
    }, []);

    const handleEditSave = useCallback(() => {
        if (!editingId) return;

        const trimmed = editingName.trim();

        setEditingId(null);
        setEditingName('');

        if (!trimmed) return;

        const original = columns.find((c) => c.id === editingId);
        if (!original || trimmed === original.name) return;

        setColumns((prev) =>
            prev.map((c) => (c.id === editingId ? { ...c, name: trimmed } : c)),
        );

        router.patch(
            WorkflowController.update.url({
                workspace,
                project: selectedProject!,
                workflow: editingId
            }),
            { name: trimmed },
            { preserveScroll: true, preserveState: true },
        );
    }, [editingId, editingName, columns, workspace.id]);

    const handleEditCancel = useCallback(() => {
        setEditingId(null);
        setEditingName('');
    }, []);

    const handleDeleteStart = useCallback((workflow: Workflow) => {
        setDeleteTarget(workflow);
    }, []);

    const handleAddColumn = useCallback(
        (name: string) => {
            router.post(
                WorkflowController.store.url({ workspace, project: selectedProject! }),
                { name },
                { preserveScroll: true },
            );
        },
        [workspace, selectedProject],
    );

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            {
                title: 'Dashboard',
                href: dashboard(),
            },
            {
                title: 'Workspace',
                href: WorkspaceController.index(),
            },
            {
                title: workspace.name,
                href: WorkspaceController.show({ workspace }),
            },
            {
                title: 'Kanban',
                href: KanbanController.index.url({ workspace: workspace.id }),
            },
        ],
        [workspace],
    );

    const handleProjectChange = useCallback(
        (projectId: string) => {
            router.get(
                KanbanController.index.url({ workspace: workspace.id }),
                { project: projectId },
                { preserveScroll: true, replace: true },
            );
        },
        [workspace.id],
    );

    const sensors = useSensors(
        useSensor(
            PointerSensor,
            {
                activationConstraint: {
                    distance: 8
                },
            },
        ),
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

                router.patch(
                    WorkflowController.reorder.url({
                        workspace,
                        project: selectedProject!,
                        workflow: active.id as string,
                    }),
                    {
                        workflows: reordered.map((c, i) => ({
                            id: c.id,
                            position: i,
                        })),
                    },
                    {
                        preserveScroll: true,
                        preserveState: true,
                    },
                );

                return reordered;
            });
        },
        [workspace.id],
    );

    const activeColumn = activeId
        ? columns.find((c) => c.id === activeId) ?? null
        : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Kanban - ${selectedProject?.name ?? workspace.name}`} />

            <DeleteWorkflowModal
                workspace={workspace}
                project={selectedProject!}
                workflow={deleteTarget}
                open={!!deleteTarget}
                onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-hidden p-4">
                <KanbanToolbar
                    projects={projects}
                    selectedProject={selectedProject}
                    handleProjectChange={handleProjectChange}
                />

                <KanbanBoard
                    projects={projects}
                    workspace={workspace}
                    workflows={columns}
                    // Sorting / Dragging
                    sensors={sensors}
                    handleDragStart={handleDragStart}
                    handleDragEnd={handleDragEnd}
                    activeColumn={activeColumn}
                    // Title Editing
                    editingId={editingId}
                    editingName={editingName}
                    handleEditStart={handleEditStart}
                    setEditingName={setEditingName}
                    handleEditSave={handleEditSave}
                    handleEditCancel={handleEditCancel}
                    // Delete
                    handleDeleteStart={handleDeleteStart}
                    // Add column
                    handleAddColumn={handleAddColumn}
                />
            </div>
        </AppLayout>
    );
}
