import { Workspace } from "./workspace";

export type Project = {
    id: string;
    workspace_id: string;
    name: string;
    codename: string;
    description: string | null;
    archived_at: string | null;
    created_at: string;
    updated_at: string;
    workspace?: Workspace;
    tasks: {
        completed: number;
        in_progress: number;
        backlog: number;
    };
};
