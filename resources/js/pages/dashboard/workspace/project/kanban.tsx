import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, Project, Workflow, Workspace } from '@/types';
import WorkspaceController from '@/actions/App/Http/Controllers/Dashboard/WorkspaceController';
import KanbanController from '@/actions/App/Http/Controllers/Dashboard/Workspace/Project/KanbanController';
import { router, usePage } from '@inertiajs/react';
import { useMemo, useCallback } from 'react';
import KanbanToolbar from '@/components/kanban/section/toolbar';
import KanbanBoard from '@/components/kanban/board';

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
        workflows,
    } = usePage().props as unknown as KanbanViewProps;

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
                href: KanbanController.url({ workspace: workspace.id }),
            },
        ],
        [workspace],
    );

    const handleProjectChange = useCallback(
        (projectId: string) => {
            router.get(
                KanbanController.url({ workspace: workspace.id }),
                { project: projectId },
                { preserveScroll: true, replace: true },
            );
        },
        [workspace.id],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Kanban - ${selectedProject?.name ?? workspace.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-hidden p-4">
                <KanbanToolbar
                    projects={projects}
                    selectedProject={selectedProject}
                    handleProjectChange={handleProjectChange}
                />

                <KanbanBoard
                    projects={projects}
                    workspace={workspace}
                    workflows={workflows}
                    selectedProject={selectedProject}
                />
            </div>
        </AppLayout>
    );
}
