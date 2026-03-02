import { Form } from '@inertiajs/react';
import { Save } from 'lucide-react';
import WorkspaceController from '@/actions/App/Http/Controllers/Dashboard/WorkspaceController';
import type { Workspace } from '@/types';
import InputError from '@/components/input-error';
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
import { Label } from '../ui/label';
import { Spinner } from '../ui/spinner';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';

type Props = {
    workspace: Workspace | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EditWorkspaceModal({ workspace, open, onOpenChange }: Props) {
    if (workspace === null) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Edit Workspace</DialogTitle>
                    <DialogDescription>
                        Ubah nama dan deskripsi workspace Anda.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...WorkspaceController.update.form(workspace)}
                    onSuccess={() => {
                        onOpenChange(false);
                        toast.success('Workspace berhasil diperbarui');
                    }}
                    onError={() => {
                        toast.error('Workspace gagal diperbarui');
                    }}
                >
                    {({ processing, errors }) => (
                        <>
                            <FieldGroup>
                                <Field>
                                    <Label htmlFor="edit-workspace-name">
                                        Nama
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="edit-workspace-name"
                                        name="name"
                                        required
                                        autoFocus
                                        defaultValue={workspace.name}
                                    />
                                    <InputError message={errors.name} />
                                </Field>

                                <Field>
                                    <Label htmlFor="edit-workspace-description">
                                        Deskripsi
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="edit-workspace-description"
                                        name="description"
                                        maxLength={255}
                                        required
                                        defaultValue={workspace.description}
                                    />
                                    <InputError message={errors.description} />
                                </Field>
                            </FieldGroup>

                            <DialogFooter className="mt-4">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" disabled={processing}>
                                        Batalkan
                                    </Button>
                                </DialogClose>

                                <Button type="submit" disabled={processing}>
                                    {processing ? <Spinner /> : <Save />}
                                    Simpan
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
