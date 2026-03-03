import ProjectController from "@/actions/App/Http/Controllers/Dashboard/Workspace/ProjectController";
import { Project, Workspace } from "@/types";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Archive, ArchiveRestore } from "lucide-react";

export default function ArchiveProjectModal({
    workspace,
    project,
    open,
    onOpenChange,
}: {
    workspace: Workspace;
    project: Project | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [isLoading, setIsLoading] = useState(false);
    if (!project) return null;

    const isArchived = !!project.archived_at;

    function handleConfirm() {
        if (!project) return;
        setIsLoading(true);
        router.patch(
            ProjectController.archive({ workspace: workspace.id, project: project.id }),
            {},
            {
                preserveScroll: true,
                onFinish: () => setIsLoading(false),
                onSuccess: () => {
                    onOpenChange(false);
                    toast.success(isArchived
                        ? 'Proyek berhasil dipulihkan.'
                        : 'Proyek berhasil diarsipkan.'
                    );
                },
                onError: () => {
                    toast.error(isArchived
                        ? 'Proyek gagal dipulihkan.'
                        : 'Proyek gagal diarsipkan.'
                    );
                }
            }
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>
                        {isArchived ? 'Pulihkan Proyek' : 'Arsipkan Proyek'}
                    </DialogTitle>
                    <DialogDescription>
                        {isArchived
                            ? `Proyek "${project.name}" akan dipulihkan dan aktif kembali.`
                            : `Proyek "${project.name}" akan diarsipkan dan tidak akan muncul di daftar aktif. Semua tugas yang terkait dengan proyek ini juga akan diarsipkan.`}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-2">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={isLoading}>
                            Batalkan
                        </Button>
                    </DialogClose>

                    <Button
                        type="button"
                        variant="outline"
                        disabled={isLoading}
                        onClick={handleConfirm}
                    >
                        {isLoading ? <Spinner /> : isArchived ? <ArchiveRestore /> : <Archive />}
                        {isArchived ? 'Pulihkan' : 'Arsipkan'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}