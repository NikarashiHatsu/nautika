import { createContext, useContext, type ReactNode } from "react";
import type { Task, TaskPriority, Workflow } from "@/types";

export type WorkflowContextValue = {
    editingId: string | null;
    editingName: string;
    onEditStart: (workflow: Workflow) => void;
    onEditChange: (value: string) => void;
    onEditSave: () => void;
    onEditCancel: () => void;
    onDeleteStart: (workflow: Workflow) => void;
    onAddTask: (columnId: string, title: string, priority: TaskPriority) => void;
    onCardClick: (task: Task) => void;
};

const WorkflowContext = createContext<WorkflowContextValue | null>(null);

export function WorkflowProvider({
    value,
    children,
}: {
    value: WorkflowContextValue;
    children: ReactNode;
}) {
    return (
        <WorkflowContext.Provider value={value}>
            {children}
        </WorkflowContext.Provider>
    );
}

export function useWorkflowContext(): WorkflowContextValue | null {
    return useContext(WorkflowContext);
}
