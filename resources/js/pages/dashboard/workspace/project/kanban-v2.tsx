import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, Project, Workspace } from '@/types';
import WorkspaceController from '@/actions/App/Http/Controllers/Dashboard/WorkspaceController';
import KanbanController from '@/actions/App/Http/Controllers/Dashboard/Workspace/Project/KanbanController';
import { usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import KanbanToolbar from '@/components/kanban/section/toolbar';
import KanbanBoardV2 from '@/components/kanban-v2/board';

type KanbanViewProps = {
    workspace: Workspace;
    projects: Project[];
};

export default function KanbanView() {
    const {
        workspace,
        projects,
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

    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
        if (projects.length > 0) {
            setSelectedProject(projects[0]);
        }
    }, [projects])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Kanban - ${selectedProject?.name ?? workspace.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-hidden p-4">
                <KanbanToolbar
                    projects={projects}
                    selectedProject={selectedProject}
                    handleProjectChange={(projectId) => setSelectedProject(projects.find((p) => p.id === projectId) ?? null)}
                />

                {selectedProject?.id && (
                    <KanbanBoardV2
                        project={selectedProject}
                    />
                )}
            </div>
        </AppLayout>
    );
}
