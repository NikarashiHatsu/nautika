import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import WorkspaceController from '@/actions/App/Http/Controllers/Dashboard/WorkspaceController';
import type { Workspace } from '@/types';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Field, FieldGroup } from '../ui/field';
import { Input } from '../ui/input';
import { Spinner } from '../ui/spinner';
import { toast } from 'sonner';

type Props = {
    workspace: Workspace | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function DeleteWorkspaceModal({ workspace, open, onOpenChange }: Props) {
    const [slugInput, setSlugInput] = useState('');

    const [isDeleting, setIsDeleting] = useState(false);

    const slugMatches = workspace !== null && slugInput === workspace.slug;

    useEffect(() => {
        if (open) {
            setSlugInput('');
        }
    }, [open]);

    function handleConfirm() {
        if (!workspace || !slugMatches) return;

        setIsDeleting(true);

        router.delete(WorkspaceController.destroy(workspace), {
            preserveScroll: true,
            onFinish: () => setIsDeleting(false),
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Workspace berhasil dihapus');
            },
            onError: () => {
                toast.error('Workspace gagal dihapus');
            },
        });
    }

    if (workspace === null) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-destructive">
                        Hapus Workspace
                    </DialogTitle>

                    <DialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Semua data di workspace
                        <strong className="font-semibold text-foreground">
                            {' '}{workspace.name}{' '}
                        </strong>
                        akan dihapus permanen. Ketik slug workspace di bawah untuk mengonfirmasi.
                    </DialogDescription>

                    <DialogDescription>
                        Ketik <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">{workspace.slug}</code> untuk konfirmasi
                    </DialogDescription>
                </DialogHeader>

                <FieldGroup>
                    <Field>
                        <Input
                            id="delete-workspace-slug"
                            value={slugInput}
                            onChange={(e) => setSlugInput(e.target.value)}
                            placeholder={workspace.slug}
                            autoComplete="off"
                            autoFocus
                            className="font-mono"
                            aria-invalid={slugInput.length > 0 && ! slugMatches}
                        />
                    </Field>
                </FieldGroup>

                <DialogFooter className="mt-4 gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={isDeleting}>
                            Batalkan
                        </Button>
                    </DialogClose>

                    <Button
                        type="button"
                        variant="destructive"
                        disabled={! slugMatches || isDeleting}
                        onClick={handleConfirm}
                    >
                        {isDeleting ? <Spinner /> : null}
                        Hapus Workspace
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
