import { SquareKanban } from "lucide-react";

export default function KanbanEmptyWorkflow() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <SquareKanban className="h-7 w-7" />
            </div>
            <div className="space-y-1">
                <p className="text-sm font-semibold">
                    Belum ada alur kerja
                </p>

                <p className="max-w-xs text-sm text-muted-foreground">
                    Proyek ini belum memiliki kolom alur kerja. Tambahkan workflow untuk mulai menggunakan Kanban.
                </p>
            </div>
        </div>
    );
}