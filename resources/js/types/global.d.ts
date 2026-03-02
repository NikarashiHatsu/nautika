import type { Auth } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            createdWorkspaces: {
                id: string;
                name: string;
                slug: string
            }[];
            [key: string]: unknown;
        };
    }
}
