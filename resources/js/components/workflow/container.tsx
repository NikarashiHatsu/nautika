import { cn } from "@/lib/utils";
import { Task, TaskChecklist, TaskPriority, User, Workflow } from "@/types";
import { AlertTriangle, CheckCircle2, Circle, GripVertical, Inbox, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useWorkflowContext } from "./provider/workflow-provider";
import TaskCard from "@/components/task/card";

const PRIORITY_DOT: Record<TaskPriority, string> = {
    high:   'bg-red-500',
    medium: 'bg-amber-400',
    low:    'bg-blue-400',
};

const MOCK_USERS: Record<string, User> = {
    AR: { id: 1, name: 'AR', email: 'ar@example.com', email_verified_at: null, created_at: '', updated_at: '' },
    DK: { id: 2, name: 'DK', email: 'dk@example.com', email_verified_at: null, created_at: '', updated_at: '' },
    FS: { id: 3, name: 'FS', email: 'fs@example.com', email_verified_at: null, created_at: '', updated_at: '' },
    NR: { id: 4, name: 'NR', email: 'nr@example.com', email_verified_at: null, created_at: '', updated_at: '' },
};

function makeChecklist(taskId: string, total: number, done: number): TaskChecklist[] {
    return Array.from({ length: total }, (_, i) => ({
        id: `${taskId}-cl-${i + 1}`,
        task_id: taskId,
        text: `Sub-tugas ${i + 1}`,
        is_done: i < done,
    }));
}

export const MOCK_TASKS: Record<'backlog' | 'todo' | 'inprogress' | 'done', Task[]> = {
    backlog: [
        {
            id: 'b1',
            workflow_id: 'backlog',
            position: 0,
            title: 'Riset kompetitor untuk fitur pembayaran',
            priority: 'low',
            description: 'Analisis 5 kompetitor utama dan dokumentasikan fitur-fitur unggulan mereka.',
            labels: [{ text: 'Riset', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' }],
            assignees: [MOCK_USERS.AR],
            comments_count: 2,
            created_at: '',
            updated_at: '',
        },
        {
            id: 'b2',
            workflow_id: 'backlog',
            position: 1,
            title: 'Desain ulang halaman profil pengguna',
            priority: 'medium',
            description: 'Update tampilan profil menggunakan design system terbaru.',
            labels: [
                { text: 'UI/UX', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300' },
                { text: 'Frontend', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
            ],
            assignees: [MOCK_USERS.DK],
            due_date: '20 Mar',
            attachments_count: 3,
            checklist: makeChecklist('b2', 4, 0),
            created_at: '',
            updated_at: '',
        },
        {
            id: 'b3',
            workflow_id: 'backlog',
            position: 2,
            title: 'Evaluasi performa database',
            priority: 'low',
            description: 'Profiling query lambat dan identifikasi bottleneck.',
            labels: [{ text: 'Backend', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' }],
            assignees: [MOCK_USERS.FS, MOCK_USERS.NR],
            comments_count: 5,
            attachments_count: 1,
            created_at: '',
            updated_at: '',
        },
    ],
    todo: [
        {
            id: 't1',
            workflow_id: 'todo',
            position: 0,
            title: 'Setup CI/CD pipeline',
            priority: 'high',
            description: 'Konfigurasi GitHub Actions untuk build, test, dan deploy otomatis.',
            labels: [{ text: 'DevOps', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' }],
            assignees: [MOCK_USERS.FS],
            due_date: '28 Feb',
            is_overdue: true,
            comments_count: 3,
            checklist: makeChecklist('t1', 5, 1),
            created_at: '',
            updated_at: '',
        },
        {
            id: 't2',
            workflow_id: 'todo',
            position: 1,
            title: 'Buat komponen form validasi',
            priority: 'medium',
            description: 'Komponen reusable dengan dukungan zod dan react-hook-form.',
            labels: [{ text: 'Frontend', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' }],
            assignees: [MOCK_USERS.DK, MOCK_USERS.AR],
            estimate_minutes: 120,
            attachments_count: 2,
            checklist: makeChecklist('t2', 3, 0),
            created_at: '',
            updated_at: '',
        },
        {
            id: 't3',
            workflow_id: 'todo',
            position: 2,
            title: 'Tulis dokumentasi API endpoint',
            priority: 'low',
            description: 'Dokumentasi lengkap menggunakan OpenAPI 3.0 / Swagger.',
            labels: [
                { text: 'Docs', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
                { text: 'Backend', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
            ],
            assignees: [MOCK_USERS.NR],
            due_date: '15 Mar',
            comments_count: 1,
            created_at: '',
            updated_at: '',
        },
    ],
    inprogress: [
        {
            id: 'p1',
            workflow_id: 'inprogress',
            position: 0,
            title: 'Integrasi payment gateway',
            priority: 'high',
            description: 'Implementasi Midtrans untuk transaksi kartu kredit dan transfer bank.',
            labels: [
                { text: 'Backend', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
                { text: 'Critical', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
            ],
            assignees: [MOCK_USERS.FS, MOCK_USERS.AR],
            estimate_minutes: 240,
            attachments_count: 5,
            comments_count: 8,
            checklist: makeChecklist('p1', 6, 3),
            created_at: '',
            updated_at: '',
        },
        {
            id: 'p2',
            workflow_id: 'inprogress',
            position: 1,
            title: 'Refactor modul autentikasi',
            priority: 'medium',
            description: 'Pisahkan logika auth ke service layer dan tambahkan unit test.',
            labels: [{ text: 'Backend', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' }],
            assignees: [MOCK_USERS.NR],
            due_date: '1 Mar',
            is_overdue: true,
            comments_count: 4,
            checklist: makeChecklist('p2', 4, 2),
            created_at: '',
            updated_at: '',
        },
    ],
    done: [
        {
            id: 'd1',
            workflow_id: 'done',
            position: 0,
            title: 'Migrasi database ke PostgreSQL',
            priority: 'medium',
            description: 'Pindahkan semua data dari MySQL ke PostgreSQL dengan zero downtime.',
            labels: [{ text: 'DevOps', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' }],
            assignees: [MOCK_USERS.FS],
            attachments_count: 2,
            comments_count: 6,
            checklist: makeChecklist('d1', 5, 5),
            is_done: true,
            created_at: '',
            updated_at: '',
        },
        {
            id: 'd2',
            workflow_id: 'done',
            position: 1,
            title: 'Implementasi dark mode',
            priority: 'low',
            description: 'Tambahkan toggle dark/light mode menggunakan CSS variables.',
            labels: [{ text: 'Frontend', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' }],
            assignees: [MOCK_USERS.DK, MOCK_USERS.AR],
            comments_count: 3,
            checklist: makeChecklist('d2', 3, 3),
            is_done: true,
            created_at: '',
            updated_at: '',
        },
        {
            id: 'd3',
            workflow_id: 'done',
            position: 2,
            title: 'Fix bug redirect setelah login',
            priority: 'high',
            description: 'Pengguna diarahkan ke halaman yang salah setelah sesi berakhir.',
            labels: [{ text: 'Bug', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' }],
            assignees: [MOCK_USERS.NR],
            comments_count: 2,
            is_done: true,
            created_at: '',
            updated_at: '',
        },
    ],
};

export function getMockTasks(workflow: Workflow): Task[] {
    if (workflow.is_backlog) return [...MOCK_TASKS.backlog];
    if (workflow.is_done)    return [...MOCK_TASKS.done];
    return workflow.position % 2 === 0 ? [...MOCK_TASKS.inprogress] : [...MOCK_TASKS.todo];
}

function getOverdueCount(tasks: Task[]): number {
    return tasks.filter((t) => t.is_overdue && !t.is_done).length;
}

export default function WorkflowContainer({
    workflow,
    tasks,
    isDragging = false,
    dragHandleProps,
    editing: editingProp,
    editValue: editValueProp,
    onEditStart: onEditStartProp,
    onEditChange: onEditChangeProp,
    onEditSave: onEditSaveProp,
    onEditCancel: onEditCancelProp,
    onDeleteStart: onDeleteStartProp,
    onAddTask: onAddTaskProp,
    onCardClick: onCardClickProp,
}: {
    workflow: Workflow;
    tasks?: Task[];
    isDragging?: boolean;
    dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
    editing?: boolean;
    editValue?: string;
    onEditStart?: () => void;
    onEditChange?: (value: string) => void;
    onEditSave?: () => void;
    onEditCancel?: () => void;
    onDeleteStart?: () => void;
    onAddTask?: (columnId: string, title: string, priority: TaskPriority) => void;
    onCardClick?: (task: Task) => void;
}) {
    const ctx = useWorkflowContext();
    const editing =
        editingProp !== undefined
            ? editingProp
            : (ctx?.editingId === workflow.id);
    const editValue = editValueProp ?? ctx?.editingName ?? '';
    const onEditStart = onEditStartProp ?? (() => ctx?.onEditStart(workflow));
    const onEditChange = onEditChangeProp ?? (ctx?.onEditChange ?? (() => {}));
    const onEditSave = onEditSaveProp ?? (ctx?.onEditSave ?? (() => {}));
    const onEditCancel = onEditCancelProp ?? (ctx?.onEditCancel ?? (() => {}));
    const onDeleteStart = onDeleteStartProp ?? (() => ctx?.onDeleteStart(workflow));
    const onAddTask = onAddTaskProp ?? (ctx?.onAddTask ?? (() => {}));
    const onCardClick = onCardClickProp ?? (ctx?.onCardClick ?? (() => {}));

    const cancelledRef  = useRef(false);
    const resolvedTasks = tasks ?? getMockTasks(workflow);
    const overdueCount  = getOverdueCount(resolvedTasks);

    const [adding, setAdding]       = useState(false);
    const [newTitle, setNewTitle]    = useState('');
    const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
    const addInputRef = useRef<HTMLTextAreaElement>(null);

    function handleAddSubmit() {
        const trimmed = newTitle.trim();
        if (!trimmed) return;
        onAddTask?.(workflow.id, trimmed, newPriority);
        setNewTitle('');
        setNewPriority('medium');
        addInputRef.current?.focus();
    }

    function handleAddCancel() {
        setAdding(false);
        setNewTitle('');
        setNewPriority('medium');
    }

    const { setNodeRef: setDropRef, isOver } = useDroppable({
        id: `col-drop-${workflow.id}`,
        data: { type: 'column-droppable', columnId: workflow.id },
    });

    return (
        <div
            className={cn(
                'flex w-72 shrink-0 flex-col rounded-xl border bg-muted/40 transition-shadow',
                overdueCount > 0
                    ? 'border-red-400/60 dark:border-red-500/40'
                    : 'border-border',
                isDragging && 'opacity-50',
            )}
        >
            {/* Header */}
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
                    {overdueCount > 0 && (
                        <span className="flex items-center gap-0.5 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            {overdueCount}
                        </span>
                    )}
                    <Badge variant="secondary" className="tabular-nums">
                        {resolvedTasks.length}
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

            {/* Card list */}
            <div
                ref={setDropRef}
                className={cn(
                    'flex flex-1 flex-col gap-2 overflow-y-auto p-2 min-h-48 transition-colors',
                    isOver && resolvedTasks.length === 0 && 'bg-primary/5',
                )}
            >
                <SortableContext
                    items={resolvedTasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {resolvedTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            columnId={workflow.id}
                            onCardClick={onCardClick}
                        />
                    ))}
                </SortableContext>

                {resolvedTasks.length === 0 && (
                    <div className={cn(
                        'flex flex-1 items-center justify-center rounded-lg border-2 border-dashed text-[11px] text-muted-foreground transition-colors min-h-24',
                        isOver
                            ? 'border-primary/50 bg-primary/5 text-primary'
                            : 'border-muted',
                    )}>
                        Drop tasks here
                    </div>
                )}
            </div>

            <div className="p-2 pt-0">
                {adding ? (
                    <div className="flex flex-col gap-2 rounded-lg border border-border bg-background p-2 shadow-sm">
                        <textarea
                            ref={addInputRef}
                            autoFocus
                            rows={2}
                            placeholder="Judul tugas…"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAddSubmit();
                                }
                                if (e.key === 'Escape') handleAddCancel();
                            }}
                            className="w-full resize-none rounded border-0 bg-transparent px-1 text-xs leading-snug outline-none placeholder:text-muted-foreground/60 focus:ring-0"
                        />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] text-muted-foreground mr-1">Prioritas:</span>
                                {(['low', 'medium', 'high'] as const).map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setNewPriority(p)}
                                        className={cn(
                                            'h-4 w-4 rounded-full border-2 transition-all',
                                            PRIORITY_DOT[p],
                                            newPriority === p
                                                ? 'border-foreground scale-110'
                                                : 'border-transparent opacity-50 hover:opacity-80',
                                        )}
                                        title={p.charAt(0).toUpperCase() + p.slice(1)}
                                    />
                                ))}
                            </div>

                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-[11px]"
                                    onClick={handleAddCancel}
                                >
                                    Batal
                                </Button>
                                <Button
                                    size="sm"
                                    className="h-6 px-2 text-[11px]"
                                    disabled={!newTitle.trim()}
                                    onClick={handleAddSubmit}
                                >
                                    Tambah
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-1.5 text-muted-foreground hover:text-foreground"
                        onClick={() => setAdding(true)}
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Tambah tugas
                    </Button>
                )}
            </div>
        </div>
    );
}
