import { Workspace } from "@/types";
import { FolderKanban } from "lucide-react";
import { Button } from "../../ui/button";
import ProjectController from "@/actions/App/Http/Controllers/Dashboard/Workspace/ProjectController";

export default function KanbanEmptyProject({
    workspace,
}: {
    workspace: Workspace,
}) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <FolderKanban className="h-7 w-7" />
            </div>

            <div className="space-y-1">
                <p className="text-sm font-semibold">
                    Belum ada proyek
                </p>

                <p className="max-w-xs text-sm text-muted-foreground">
                    Workspace ini belum memiliki proyek. Buat proyek terlebih dahulu untuk menggunakan Kanban.
                </p>
            </div>

            <Button asChild size="sm">
                <a href={ProjectController.index({ workspace }).url}>
                    Kelola proyek
                </a>
            </Button>
        </div>
    );
}