import WorkspaceController from "@/actions/App/Http/Controllers/Dashboard/WorkspaceController";
import { NavItem } from "@/types";
import { usePage } from "@inertiajs/react";
import { CalendarDays, ChevronRightIcon, Cog, FileCheck, Folder, FolderGit, LayoutList, Paperclip, ScrollText, SquareKanban, Users } from "lucide-react";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "../ui/sidebar";
import { useCurrentUrl } from "@/hooks/use-current-url";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

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
                    const { isCurrentUrl } = useCurrentUrl();

                    return (
                        <SidebarMenuItem key={item.id ?? item.title}>
                            <Collapsible>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        className="cursor-pointer group"
                                        tooltip={{ children: item.title }}
                                    >
                                        <Folder />
                                        <span>{item.title}</span>

                                        <SidebarMenuAction>
                                            <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
                                        </SidebarMenuAction>
                                    </SidebarMenuButton>
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

                                            <SidebarMenuSubButton>
                                                <FolderGit strokeWidth={1.5} />
                                                <span>
                                                    Proyek
                                                </span>
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