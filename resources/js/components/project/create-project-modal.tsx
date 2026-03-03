import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { PlusIcon, Save } from "lucide-react";
import { Form } from "@inertiajs/react";
import ProjectController from "@/actions/App/Http/Controllers/Dashboard/Workspace/ProjectController";
import { Workspace } from "@/types";
import { toast } from "sonner";
import { Field, FieldGroup } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import InputError from "../input-error";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";

export default function CreateProjectModal({
    workspace
}: {
    workspace: Workspace
}) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusIcon />
                    Tambah Proyek
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Tambah Proyek</DialogTitle>
                    <DialogDescription>
                        Buat proyek baru di dalam workspace ini.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...ProjectController.store.form(workspace.id)}
                    onSuccess={() => {
                        setOpen(false);
                        toast.success('Proyek berhasil dibuat');
                    }}
                    onError={() => {
                        toast.error('Proyek gagal dibuat');
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
                                        placeholder="Mobile App Redesign"
                                        required
                                        autoFocus
                                    />
                                    <InputError message={errors.name} />
                                </Field>

                                <Field>
                                    <Label htmlFor="codename">
                                        Kode Proyek
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="codename"
                                        name="codename"
                                        placeholder="PROJ-001"
                                        className="font-mono"
                                        required
                                    />
                                    <InputError message={errors.codename} />
                                </Field>

                                <Field>
                                    <Label htmlFor="description">Deskripsi</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Deskripsikan tujuan proyek ini…"
                                        maxLength={255}
                                        rows={3}
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