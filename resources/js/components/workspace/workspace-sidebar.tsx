import WorkspaceController from "@/actions/App/Http/Controllers/Dashboard/WorkspaceController";
import { NavItem } from "@/types";
import { Link, usePage } from "@inertiajs/react";
import { CalendarDays, ChevronRightIcon, Cog, FileCheck, Folder, FolderKanban, LayoutList, Paperclip, ScrollText, SquareKanban, Users } from "lucide-react";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "../ui/sidebar";
import { useCurrentUrl } from "@/hooks/use-current-url";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import ProjectController from "@/actions/App/Http/Controllers/Dashboard/Workspace/ProjectController";
import KanbanController from "@/actions/App/Http/Controllers/Dashboard/Workspace/Project/KanbanController";

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
                    const isParentActive = useCurrentUrl().isCurrentOrParentUrl(item.href);

                    const isMenuActive = (currentUrl: string) => useCurrentUrl().isCurrentUrl(currentUrl);

                    return (
                        <Collapsible defaultOpen={isParentActive} key={item.id ?? item.title}>
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={item.title}>
                                        <Folder strokeWidth={1.5} />
                                        <span>{item.title}</span>

                                        <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <SidebarGroupLabel>
                                                Navigasi
                                            </SidebarGroupLabel>

                                            <SidebarMenuSubButton
                                                asChild
                                                isActive={isMenuActive(KanbanController.url({ workspace: item.id! }))}
                                            >
                                                <Link href={KanbanController.url({ workspace: item.id! })}>
                                                    <SquareKanban strokeWidth={1.5} />
                                                    <span>
                                                        Kanban
                                                    </span>
                                                </Link>
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
                                                isActive={isMenuActive(ProjectController.index({ workspace: item.id! }).url)}
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
                            </SidebarMenuItem>
                        </Collapsible>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}