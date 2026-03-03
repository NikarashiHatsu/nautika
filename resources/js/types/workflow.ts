import { Project } from "./project";

export type Workflow = {
    id: string;
    project_id: string;
    position: number;
    name: string;
    slug: string;
    is_backlog: boolean;
    is_done: boolean;
    created_at: string;
    updated_at: string;
    project?: Project;
};
