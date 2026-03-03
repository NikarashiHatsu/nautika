import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, Project, Workspace } from '@/types';
import WorkspaceController from '@/actions/App/Http/Controllers/Dashboard/WorkspaceController';
import { usePage } from '@inertiajs/react';
import ProjectController from '@/actions/App/Http/Controllers/Dashboard/Workspace/ProjectController';
import { useMemo, useState } from 'react';
import EditProjectModal from '@/components/project/edit-project-modal';
import ArchiveProjectModal from '@/components/project/archive-project-modal';
import DeleteProjectModal from '@/components/project/delete-project-modal';
import ProjectList from '@/components/project/project-list';

type ProjectIndexProps = {
    workspace: Workspace;
    projects: Project[];
};

export default function ProjectIndex() {
    const { workspace, projects } = usePage().props as unknown as ProjectIndexProps;

    const [editTarget, setEditTarget] = useState<Project | null>(null);
    const [archiveTarget, setArchiveTarget] = useState<Project | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: 'Dashboard', href: dashboard() },
            {
                title: 'Workspace',
                href: WorkspaceController.index(),
            },
            {
                title: workspace.name,
                href: WorkspaceController.show({ workspace }),
            },
            {
                title: 'Proyek',
                href: ProjectController.index({ workspace }),
            },
        ],
        [workspace],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Project" />

            <EditProjectModal
                workspace={workspace}
                project={editTarget}
                open={!!editTarget}
                onOpenChange={(o) => { if (!o) setEditTarget(null); }}
            />

            <ArchiveProjectModal
                workspace={workspace}
                project={archiveTarget}
                open={!!archiveTarget}
                onOpenChange={(o) => { if (!o) setArchiveTarget(null); }}
            />

            <DeleteProjectModal
                workspace={workspace}
                project={deleteTarget}
                open={!!deleteTarget}
                onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}
            />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <ProjectList
                    workspace={workspace}
                    projects={projects}
                    setEditTarget={setEditTarget}
                    setArchiveTarget={setArchiveTarget}
                    setDeleteTarget={setDeleteTarget}
                />
            </div>
        </AppLayout>
    );
}
