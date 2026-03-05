import { Attachable } from "./attachable";
import { User } from "./auth";
import { Commentable } from "./commentable";
import { TaskChecklist } from "./task-checklist";
import { TaskLabel } from "./task-label";
import { TaskPriority } from "./task-priority";

export type Task = {
    id: string;
    workflow_id: string;
    position: number;
    title: string;
    description?: string;
    priority: TaskPriority;
    due_date?: string;
    estimate_minutes?: number;
    completed_at?: string;
    created_at: string;
    updated_at: string;
    // Relation
    labels?: TaskLabel[];
    assignees?: User[];
    checklist?: TaskChecklist[];
    attachments?: Attachable[];
    comments?: Commentable[];
    // State
    is_overdue?: boolean;
    attachments_count?: number;
    comments_count?: number;
    is_done?: boolean;
};