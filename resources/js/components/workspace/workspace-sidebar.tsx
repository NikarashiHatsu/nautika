import WorkspaceController from "@/actions/App/Http/Controllers/Dashboard/WorkspaceController";
import { NavItem } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { CalendarDays, ChevronRightIcon, Cog, FileCheck, Folder, FolderGit, FolderKanban, LayoutList, Paperclip, ScrollText, SquareKanban, Users } from "lucide-react";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "../ui/sidebar";
import { useCurrentUrl } from "@/hooks/use-current-url";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import ProjectController from "@/actions/App/Http/Controllers/Dashboard/Workspace/ProjectController";
import { Button } from "../ui/button";

export default function WorkspaceSidebar() {
    const { createdWorkspaces = [] } = usePage().props;

    const quickAccessItems: NavItem[] = createdWorkspaces.map((workspace) => ({
        id: workspace.id,
        title: workspace.name,
        href: WorkspaceController.show(workspace),
    }));

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>
                Akses Cepat Workspace
            </SidebarGroupLabel>

            <SidebarMenu>
                {quickAccessItems.map((item) => {
                    const isActive = useCurrentUrl().isCurrentOrParentUrl(item.href);

                    return (
                        <SidebarMenuItem key={item.id ?? item.title}>
                            <Collapsible defaultOpen={isActive}>
                                <CollapsibleTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="group w-full justify-between transition-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Folder strokeWidth={1.5} />
                                            <span>{item.title}</span>
                                        </div>

                                        <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
                                    </Button>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <SidebarGroupLabel>
                                                Navigasi
                                            </SidebarGroupLabel>

                                            <SidebarMenuSubButton>
                                                <SquareKanban strokeWidth={1.5} />
                                                <span>
                                                    Kanban
                                                </span>
                                            </SidebarMenuSubButton>

                                            <SidebarMenuSubButton>
                                                <CalendarDays strokeWidth={1.5} />
                                                <span>
                                                    Kalender
                                                </span>
                                            </SidebarMenuSubButton>

                                            <SidebarMenuSubButton>
                                                <LayoutList strokeWidth={1.5} />
                                                <span>
                                                    List
                                                </span>
                                            </SidebarMenuSubButton>

                                            <SidebarGroupLabel>
                                                Ruang Kerja
                                            </SidebarGroupLabel>

                                            <SidebarMenuSubButton
                                                asChild
                                                isActive={isActive}
                                            >
                                                <Link href={ProjectController.index({ workspace: item.id! })}>
                                                    <FolderKanban strokeWidth={1.5} />
                                                    <span>
                                                        Proyek
                                                    </span>
                                                </Link>
                                            </SidebarMenuSubButton>

                                            <SidebarMenuSubButton>
                                                <FileCheck strokeWidth={1.5} />
                                                <span>
                                                    Tugas
                                                </span>
                                            </SidebarMenuSubButton>

                                            <SidebarMenuSubButton>
                                                <ScrollText strokeWidth={1.5} />
                                                <span>
                                                    Catatan
                                                </span>
                                            </SidebarMenuSubButton>

                                            <SidebarMenuSubButton>
                                                <Paperclip strokeWidth={1.5} />
                                                <span>
                                                    Lampiran
                                                </span>
                                            </SidebarMenuSubButton>

                                            <SidebarGroupLabel>
                                                Kolaborasi
                                            </SidebarGroupLabel>

                                            <SidebarMenuSubButton>
                                                <Users strokeWidth={1.5} />
                                                <span>
                                                    Anggota
                                                </span>
                                            </SidebarMenuSubButton>

                                            <SidebarMenuSubButton>
                                                <Cog strokeWidth={1.5} />
                                                <span>
                                                    Pengaturan
                                                </span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </Collapsible>
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}