export type Workspace = {
    id: string;
    name: string;
    slug: string;
    description: string;
    owner_id: number;
    settings: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
};

export type WorkspaceFilters = {
    search: string;
    sort: string;
    direction: 'asc' | 'desc';
    per_page: number;
};
