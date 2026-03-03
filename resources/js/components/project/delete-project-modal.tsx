import ProjectController from "@/actions/App/Http/Controllers/Dashboard/Workspace/ProjectController";
import { Project, Workspace } from "@/types";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Field, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Trash2 } from "lucide-react";

export default function DeleteProjectModal({
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
    const [codenameInput, setCodenameInput] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const matches = project !== null && codenameInput === project.codename;

    useState(() => { if (open) setCodenameInput(''); });

    if (!project) return null;

    function handleDelete() {
        if (!project || !matches) return;

        setIsDeleting(true);

        router.delete(
            ProjectController.destroy({ workspace: workspace.id, project: project.id }),
            {
                preserveScroll: true,
                onFinish: () => setIsDeleting(false),
                onSuccess: () => {
                    onOpenChange(false);
                    toast.success('Proyek berhasil dihapus');
                },
                onError: () => toast.error('Proyek gagal dihapus'),
            }
        );
    }

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) setCodenameInput(''); onOpenChange(o); }}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-destructive">
                        Hapus Proyek
                    </DialogTitle>
                    <DialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Semua data proyek{' '}
                        <strong className="font-semibold text-foreground">{project.name}</strong> akan
                        dihapus permanen.
                    </DialogDescription>
                    <DialogDescription>
                        Ketik{' '}
                        <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
                            {project.codename}
                        </code>{' '}
                        untuk konfirmasi.
                    </DialogDescription>
                </DialogHeader>

                <FieldGroup>
                    <Field>
                        <Input
                            value={codenameInput}
                            onChange={(e) => setCodenameInput(e.target.value)}
                            placeholder={project.codename}
                            autoComplete="off"
                            autoFocus
                            className="font-mono"
                            aria-invalid={codenameInput.length > 0 && !matches}
                        />
                    </Field>
                </FieldGroup>

                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={isDeleting}>
                            Batalkan
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={!matches || isDeleting}
                        onClick={handleDelete}
                    >
                        {isDeleting ? <Spinner /> : <Trash2 />}
                        Hapus Proyek
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}