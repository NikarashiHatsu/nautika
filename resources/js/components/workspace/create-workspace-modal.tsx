import { useState } from "react";
import { Form } from "@inertiajs/react";
import { PlusIcon, Save } from "lucide-react";
import WorkspaceController from "@/actions/App/Http/Controllers/Dashboard/WorkspaceController";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../ui/dialog";
import { Field, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";
import InputError from "../input-error";
import { toast } from "sonner";

export function CreateWorkspaceModal() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusIcon />
                    Tambah Workspace
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>
                        Tambah Workspace
                    </DialogTitle>
                    <DialogDescription>
                        Buat Workspace baru untuk mengelola proyek-proyek Anda.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...WorkspaceController.store.form()}
                    onSuccess={() => {
                        setOpen(false);
                        toast.success('Workspace berhasil dibuat');
                    }}
                    onError={() => {
                        toast.error('Workspace gagal dibuat');
                    }}
                >
                    {({ processing, errors }) => (
                        <>
                            <FieldGroup>
                                <Field>
                                    <Label htmlFor="name">
                                        Nama
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        required
                                        autoFocus
                                    />
                                    <InputError message={errors.name} />
                                </Field>

                                <Field>
                                    <Label htmlFor="description">
                                        Deskripsi
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        maxLength={255}
                                        required
                                    />
                                    <InputError message={errors.description} />
                                </Field>
                            </FieldGroup>

                            <DialogFooter className="mt-4">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
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