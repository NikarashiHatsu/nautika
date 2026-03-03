import { Project } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { cn } from "@/lib/utils";

export default function KanbanToolbar({
    projects,
    selectedProject,
    handleProjectChange,
}: {
    projects: Project[];
    selectedProject: Project | null;
    handleProjectChange: (projectId: string) => void;
}) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
                {projects.length > 0 && (
                    <Select
                        value={selectedProject?.id ?? ''}
                        onValueChange={handleProjectChange}
                    >
                        <SelectTrigger className="w-56">
                            <SelectValue placeholder="Pilih proyek…" />
                        </SelectTrigger>

                        <SelectContent>
                            {projects.map((p) => (
                                <SelectItem key={p.id} value={p.id}>
                                    <span className="font-medium">
                                        {p.name}
                                    </span>
                                    <span className="ml-1.5 font-mono text-xs text-muted-foreground">
                                        {p.codename}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {selectedProject?.description && (
                    <p className="hidden truncate text-sm text-muted-foreground sm:block">
                        {selectedProject.description}
                    </p>
                )}
            </div>
        </div>
    );
}