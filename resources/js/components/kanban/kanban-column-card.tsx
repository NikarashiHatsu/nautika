import { cn } from "@/lib/utils";
import { Workflow } from "@/types";
import { CheckCircle2, Circle, GripVertical, Inbox, MoreHorizontal, Plus, SquareKanban, Trash2 } from "lucide-react";
import { useRef } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function KanbanColumnCard({
    workflow,
    isDragging = false,
    dragHandleProps,
    editing = false,
    editValue = '',
    onEditStart,
    onEditChange,
    onEditSave,
    onEditCancel,
    onDeleteStart,
}: {
    workflow: Workflow;
    isDragging?: boolean;
    dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
    editing?: boolean;
    editValue?: string;
    onEditStart?: () => void;
    onEditChange?: (value: string) => void;
    onEditSave?: () => void;
    onEditCancel?: () => void;
    onDeleteStart?: () => void;
}) {
    const cancelledRef = useRef(false);

    return (
        <div
            className={cn(
                'flex w-72 shrink-0 flex-col rounded-xl border border-border bg-muted/40 transition-shadow',
                isDragging && 'opacity-50',
            )}
        >
            <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                    {workflow.is_done ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                    ) : workflow.is_backlog ? (
                        <Inbox className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                        <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}

                    {editing ? (
                        <input
                            autoFocus
                            value={editValue}
                            onChange={(e) => onEditChange?.(e.target.value)}
                            onBlur={() => {
                                if (!cancelledRef.current) onEditSave?.();
                                cancelledRef.current = false;
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    onEditSave?.();
                                }
                                if (e.key === 'Escape') {
                                    e.preventDefault();
                                    cancelledRef.current = true;
                                    onEditCancel?.();
                                }
                            }}
                            className="min-w-0 flex-1 rounded border border-border bg-background px-1.5 py-0.5 text-sm font-medium outline-none ring-ring focus:ring-2"
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={onEditStart}
                            title="Klik untuk mengubah nama"
                            className="min-w-0 truncate text-left text-sm font-medium hover:opacity-70"
                        >
                            {workflow.name}
                        </button>
                    )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <Badge variant="secondary" className="tabular-nums">
                        0
                    </Badge>

                    {!workflow.is_backlog && !workflow.is_done && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground/50 hover:text-muted-foreground"
                                    title="Opsi kolom"
                                >
                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onSelect={onDeleteStart}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Hapus kolom
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <div
                        {...dragHandleProps}
                        className="flex h-5 w-5 cursor-grab items-center justify-center rounded text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing"
                        title="Seret untuk mengubah urutan"
                    >
                        <GripVertical className="h-3.5 w-3.5" />
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2 min-h-48">
                <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-8 text-center">
                    <SquareKanban className="h-6 w-6 text-muted-foreground/40" />
                    <p className="text-xs text-muted-foreground">Belum ada tugas</p>
                </div>
            </div>

            <div className="p-2 pt-0">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-1.5 text-muted-foreground hover:text-foreground"
                >
                    <Plus className="h-3.5 w-3.5" />
                    Tambah tugas
                </Button>
            </div>
        </div>
    );
}