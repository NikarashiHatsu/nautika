import { useEffect, useMemo, useRef, useState } from 'react';
import {
    type ColumnDef,
    type SortingState,
    type Updater,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { router } from '@inertiajs/react';
import { ArrowDownIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsUpDownIcon, Eye, MoreHorizontalIcon, PencilIcon, SearchIcon, Trash2Icon } from 'lucide-react';
import WorkspaceController from '@/actions/App/Http/Controllers/Dashboard/WorkspaceController';
import type { Paginator, Workspace, WorkspaceFilters } from '@/types';
import { DeleteWorkspaceModal } from './delete-workspace-modal';
import { EditWorkspaceModal } from './edit-workspace-modal';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';

const PER_PAGE_OPTIONS = [10, 25, 50, 100] as const;

function WorkspaceOptionsCell({ workspace }: { workspace: Workspace }) {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon className="size-4" />
                        <span className="sr-only">Buka opsi</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() =>
                            router.visit(WorkspaceController.show(workspace))
                        }
                    >
                        <Eye className="size-4" />
                        Lihat
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setEditModalOpen(true)}>
                        <PencilIcon className="size-4" />
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDeleteModalOpen(true)}
                    >
                        <Trash2Icon className="size-4" />
                        Hapus
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditWorkspaceModal
                workspace={workspace}
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
            />

            <DeleteWorkspaceModal
                workspace={workspace}
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
            />
        </>
    );
}

const columns: ColumnDef<Workspace>[] = [
    {
        accessorKey: 'id',
        header: 'Opsi',
        enableSorting: false,
        cell: ({ row }) => <WorkspaceOptionsCell workspace={row.original} />,
    },
    {
        accessorKey: 'name',
        header: 'Nama',
    },
    {
        accessorKey: 'slug',
        header: 'Slug',
        cell: ({ getValue }) => (
            <span className="font-mono text-xs text-muted-foreground">
                {getValue<string>()}
            </span>
        ),
    },
    {
        accessorKey: 'description',
        header: 'Deskripsi',
        cell: ({ getValue }) => (
            <span className="line-clamp-2 max-w-sm whitespace-normal">
                {getValue<string>()}
            </span>
        ),
    },
    {
        accessorKey: 'created_at',
        header: 'Tanggal Input',
        cell: ({ getValue }) => (
            <span className="text-muted-foreground">
                {new Intl.DateTimeFormat('id-ID', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                    timeZone: 'Asia/Jakarta',
                }).format(new Date(getValue<string>()))}
            </span>
        ),
    },
];

type Props = {
    paginator: Paginator<Workspace>;
    filters: WorkspaceFilters;
};

function SortIcon({ sorted }: { sorted: false | 'asc' | 'desc' }) {
    if (sorted === 'asc') return <ArrowUpIcon className="size-3.5" />;
    if (sorted === 'desc') return <ArrowDownIcon className="size-3.5" />;
    return <ChevronsUpDownIcon className="size-3.5 opacity-50" />;
}

function navigate(params: Record<string, string | number>) {
    router.get(WorkspaceController.index.url(), params, {
        preserveState: true,
        preserveScroll: true,
        replace: true,
    });
}

export default function WorkspaceTable({ paginator, filters }: Props) {
    const [search, setSearch] = useState(filters.search);
    const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null);

    useEffect(() => {
        setSearch(filters.search);
    }, [filters.search]);

    const sorting = useMemo<SortingState>(
        () => (
            filters.sort
                ? [{ id: filters.sort, desc: filters.direction === 'desc' }]
                : []
            ),
        [filters.sort, filters.direction],
    );

    function handleSearch(value: string) {
        setSearch(value);

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        searchTimeout.current = setTimeout(() => {
            navigate({
                search: value,
                sort: filters.sort,
                direction: filters.direction,
                per_page: filters.per_page,
                page: 1,
            });
        }, 300);
    }

    function handleSortingChange(updater: Updater<SortingState>) {
        const next = typeof updater === 'function'
            ? updater(sorting)
            : updater;

        navigate({
            search,
            sort: next[0]?.id ?? 'created_at',
            direction: next[0]?.desc ? 'desc' : 'asc',
            per_page: filters.per_page,
            page: 1,
        });
    }

    function goToPage(page: number) {
        navigate({
            search,
            sort: filters.sort,
            direction: filters.direction,
            per_page: filters.per_page,
            page,
        });
    }

    function handlePerPageChange(value: string) {
        const perPage = Number(value);

        navigate({
            search,
            sort: filters.sort,
            direction: filters.direction,
            per_page: perPage,
            page: 1,
        });
    }

    const table = useReactTable({
        data: paginator.data,
        columns,
        state: { sorting },
        onSortingChange: handleSortingChange,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        manualPagination: true,
        pageCount: paginator.last_page,
    });

    return (
        <div className="flex flex-col gap-4">
            <div className="relative w-72">
                <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                    className="pl-8"
                    placeholder="Cari workspace..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="-ml-3 h-8 gap-1.5"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                            <SortIcon sorted={header.column.getIsSorted()} />
                                        </Button>
                                    ) : (
                                        flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center text-muted-foreground"
                            >
                                {search ? `Tidak ada hasil untuk "${search}".` : 'Belum ada workspace.'}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                    <span>
                        {paginator.total > 0
                            ? `Menampilkan ${paginator.from}-${paginator.to} dari ${paginator.total} data`
                            : 'Tidak ada data'}
                    </span>

                    <div className="flex items-center gap-2">
                        <span className="whitespace-nowrap">Per halaman:</span>

                        <Select
                            value={String(filters.per_page)}
                            onValueChange={handlePerPageChange}
                        >
                            <SelectTrigger size="sm" className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PER_PAGE_OPTIONS.map((n) => (
                                    <SelectItem key={n} value={String(n)}>
                                        {n}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        disabled={paginator.current_page === 1}
                        onClick={() => goToPage(paginator.current_page - 1)}
                    >
                        <ChevronLeftIcon className="size-4" />
                    </Button>

                    {Array.from({ length: paginator.last_page }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={page === paginator.current_page ? 'default' : 'outline'}
                            size="icon"
                            className="size-8"
                            onClick={() => goToPage(page)}
                        >
                            {page}
                        </Button>
                    ))}

                    <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        disabled={paginator.current_page === paginator.last_page}
                        onClick={() => goToPage(paginator.current_page + 1)}
                    >
                        <ChevronRightIcon className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
