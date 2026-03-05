import WorkflowController from '@/actions/App/Http/Controllers/Dashboard/Workspace/Project/WorkflowController';
import { Project, Workflow, Workspace } from '@/types';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../ui/dialog';
import { Field, FieldGroup } from '../../ui/field';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Spinner } from '../../ui/spinner';

export default function DeleteWorkflowModal({
    workspace,
    project,
    workflow,
    open,
    onOpenChange,
}: {
    workspace: Workspace;
    project: Project;
    workflow: Workflow | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [slugInput, setSlugInput] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const matches = workflow !== null && slugInput === workflow.slug;

    useEffect(() => {
        if (open) setSlugInput('');
    }, [open]);

    if (!workflow) return null;

    function handleDelete() {
        if (!workflow || !matches) return;

        setIsDeleting(true);

        router.delete(
            WorkflowController.destroy.url({ workspace, project, workflow }),
            {
                preserveScroll: true,
                onFinish: () => setIsDeleting(false),
                onSuccess: () => {
                    onOpenChange(false);
                    toast.success('Kolom berhasil dihapus');
                },
                onError: () => toast.error('Kolom gagal dihapus'),
            },
        );
    }

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) setSlugInput(''); onOpenChange(o); }}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-destructive">
                        Hapus Kolom
                    </DialogTitle>
                    <DialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Kolom{' '}
                        <strong className="font-semibold text-foreground">{workflow.name}</strong> akan
                        dihapus permanen. Semua tugas di kolom ini akan dipindahkan ke{' '}
                        <strong className="font-semibold text-foreground">Backlog</strong>.
                    </DialogDescription>
                    <DialogDescription>
                        Ketik{' '}
                        <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
                            {workflow.slug}
                        </code>{' '}
                        untuk konfirmasi.
                    </DialogDescription>
                </DialogHeader>

                <FieldGroup>
                    <Field>
                        <Input
                            value={slugInput}
                            onChange={(e) => setSlugInput(e.target.value)}
                            placeholder={workflow.slug}
                            autoComplete="off"
                            autoFocus
                            className="font-mono"
                            aria-invalid={slugInput.length > 0 && !matches}
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
                        Hapus Kolom
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
