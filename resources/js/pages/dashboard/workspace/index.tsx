import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, Paginator, Workspace, WorkspaceFilters } from '@/types';
import { CreateWorkspaceModal } from '@/components/workspace/create-workspace-modal';
import WorkspaceTable from '@/components/workspace/workspace-table';
import WorkspaceController from '@/actions/App/Http/Controllers/Dashboard/WorkspaceController';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Workspace',
        href: WorkspaceController.index(),
    },
];

type Props = {
    workspaces: Paginator<Workspace>;
    filters: WorkspaceFilters;
};

export default function WorkspaceIndex({ workspaces, filters }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Workspace" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex justify-end">
                    <CreateWorkspaceModal />
                </div>
                <WorkspaceTable paginator={workspaces} filters={filters} />
            </div>
        </AppLayout>
    );
}
