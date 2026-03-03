import { Project, Workspace } from "@/types";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form } from "@inertiajs/react";
import ProjectController from "@/actions/App/Http/Controllers/Dashboard/Workspace/ProjectController";
import { toast } from "sonner";
import { Field, FieldGroup } from "../ui/field";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import InputError from "../input-error";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Save } from "lucide-react";

export default function EditProjectModal({
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
    if (!project) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>
                        Edit Proyek
                    </DialogTitle>
                    <DialogDescription>
                        Ubah detail proyek ini.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...ProjectController.update.form({ workspace: workspace.id, project: project })}
                    onSuccess={() => {
                        onOpenChange(false);
                        toast.success('Proyek berhasil diperbarui');
                    }}
                    onError={() => toast.error('Proyek gagal diperbarui')}
                >
                    {({ processing, errors }) => (
                        <>
                            <FieldGroup>
                                <Field>
                                    <Label htmlFor="edit-project-name">
                                        Nama
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="edit-project-name"
                                        name="name"
                                        required
                                        autoFocus
                                        defaultValue={project.name}
                                    />
                                    <InputError message={errors.name} />
                                </Field>

                                <Field>
                                    <Label htmlFor="edit-project-codename">
                                        Kode Proyek
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="edit-project-codename"
                                        name="codename"
                                        required
                                        className="font-mono"
                                        defaultValue={project.codename}
                                    />
                                    <InputError message={errors.codename} />
                                </Field>

                                <Field>
                                    <Label htmlFor="edit-project-description">Deskripsi</Label>
                                    <Textarea
                                        id="edit-project-description"
                                        name="description"
                                        maxLength={255}
                                        rows={3}
                                        defaultValue={project.description ?? ''}
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