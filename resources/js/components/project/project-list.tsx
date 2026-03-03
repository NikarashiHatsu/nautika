import { Project, Workspace } from "@/types";
import { Archive, ArchiveRestore, CheckCheck, CheckSquare, Clock, FolderKanban, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import CreateProjectModal from "./create-project-modal";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export default function ProjectList({
    workspace,
    projects,
    setEditTarget,
    setArchiveTarget,
    setDeleteTarget,
}: {
    workspace: Workspace;
    projects: Project[];
    setEditTarget: (project: Project) => void;
    setArchiveTarget: (project: Project) => void;
    setDeleteTarget: (project: Project) => void;
}) {
    if (projects.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <FolderKanban className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                    <p className="font-semibold text-sm">
                        Belum ada proyek
                    </p>
                    <p className="text-sm text-muted-foreground max-w-xs">
                        Workspace ini belum memiliki proyek. Mulai dengan membuat proyek pertama Anda.
                    </p>
                </div>
                <CreateProjectModal workspace={workspace} />
            </div>
        );
    }

    return (
        <>
            <div className="flex justify-end">
                <CreateProjectModal workspace={workspace} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <FolderKanban className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-sm leading-tight">{project.name}</p>
                                    <p className="truncate text-xs text-muted-foreground font-mono">{project.codename}</p>
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                                {project.archived_at && (
                                    <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                        <Archive className="h-3 w-3" />
                                        Diarsipkan
                                    </span>
                                )}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Opsi proyek</span>
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end" className="w-44">
                                        <DropdownMenuItem onClick={() => setEditTarget(project)}>
                                            <Pencil className="h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>

                                        <DropdownMenuItem onClick={() => setArchiveTarget(project)}>
                                            {project.archived_at
                                                ? <ArchiveRestore className="h-4 w-4" />
                                                : <Archive className="h-4 w-4" />}
                                            {project.archived_at ? 'Pulihkan' : 'Arsipkan'}
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem
                                            onClick={() => setDeleteTarget(project)}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Hapus
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>

                        {(() => {
                            const { completed, in_progress, backlog } = project.tasks;
                            const total = completed + in_progress + backlog;
                            const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0);
                            const allDone = completed === total;
                            return (
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-1 text-muted-foreground">
                                            <CheckSquare className="h-3 w-3" />
                                            Tasks
                                        </span>
                                        <span className={allDone ? 'font-medium text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                                            {completed}/{total} ({total > 0 ? `${Math.round((completed / total) * 100)}%` : '0%'})
                                        </span>
                                    </div>
                                    <div className="flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full">
                                        {completed > 0 && (
                                            <div
                                                className="h-full rounded-full bg-green-500 transition-all"
                                                style={{ width: `${pct(completed)}%` }}
                                            />
                                        )}
                                        {in_progress > 0 && (
                                            <div
                                                className="h-full rounded-full bg-amber-400 transition-all"
                                                style={{ width: `${pct(in_progress)}%` }}
                                            />
                                        )}
                                        {backlog > 0 && (
                                            <div
                                                className="h-full rounded-full bg-muted transition-all"
                                                style={{ width: `${pct(backlog)}%` }}
                                            />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                                            {completed} done
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
                                            {in_progress} in progress
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                                            {backlog} backlog
                                        </span>
                                    </div>
                                </div>
                            );
                        })()}

                        <div className="mt-auto flex items-center gap-1 text-xs text-muted-foreground -mb-1.5">
                            <CheckCheck className="h-3 w-3" />
                            <span>Dibuat {new Intl.DateTimeFormat('id-ID', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                                timeZone: 'Asia/Jakarta',
                            }).format(new Date(project.created_at))}</span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Diubah {new Intl.DateTimeFormat('id-ID', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                                timeZone: 'Asia/Jakarta',
                            }).format(new Date(project.updated_at))}</span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}