import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Task, User } from "@/types";
import { Check, Users } from "lucide-react";

type TeamMember = {
    id: number;
    initials: string;
    name: string;
    email: string;
    color: string;
};

const TEAM_MEMBERS_MOCK: TeamMember[] = [
    { id: 10, initials: 'BS', name: 'Budi Santoso',   email: 'bs@example.com', color: 'bg-blue-500' },
    { id: 11, initials: 'AW', name: 'Ani Wijaya',     email: 'aw@example.com', color: 'bg-violet-500' },
    { id: 12, initials: 'RP', name: 'Reza Pratama',   email: 'rp@example.com', color: 'bg-green-500' },
    { id: 13, initials: 'DK', name: 'Dewi Kusuma',    email: 'dk@example.com', color: 'bg-rose-500' },
    { id: 14, initials: 'HG', name: 'Hendra Gunawan', email: 'hg@example.com', color: 'bg-amber-500' },
    { id: 15, initials: 'AR', name: 'Adi Rahardian',  email: 'ar@example.com', color: 'bg-cyan-500' },
    { id: 16, initials: 'FS', name: 'Fajar Setiawan', email: 'fs@example.com', color: 'bg-orange-500' },
    { id: 17, initials: 'NR', name: 'Nadia Rahma',    email: 'nr@example.com', color: 'bg-pink-500' },
];

const TEAM_MEMBERS = TEAM_MEMBERS_MOCK.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    email_verified_at: null,
    created_at: '',
    updated_at: '',
}));

export default function TaskActionAssignee({
    task,
    onUpdate,
}: {
    task: Task;
    onUpdate: (task: Task) => void;
}) {
    function getUserInitials(user: User): string {
        return user.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    function getMemberColor(user: User): string {
        const colors = [
            'bg-red-500',
            'bg-orange-500',
            'bg-amber-500',
            'bg-yellow-500',
            'bg-lime-500',
            'bg-green-500',
            'bg-emerald-500',
            'bg-teal-500',
            'bg-cyan-500',
            'bg-sky-500',
            'bg-blue-500',
            'bg-indigo-500',
            'bg-violet-500',
            'bg-purple-500',
            'bg-fuchsia-500',
            'bg-pink-500',
            'bg-rose-500',
            'bg-slate-500',
            'bg-gray-500',
            'bg-zinc-500',
            'bg-neutral-500',
            'bg-stone-500',
            'bg-taupe-500',
            'bg-mauve-500',
            'bg-mist-500',
            'bg-olive-500',
        ];

        return colors[user.id % colors.length];
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md bg-muted px-2.5 py-1.5 text-xs transition-colors hover:bg-muted/80"
                >
                    <Users className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

                    {(task.assignees ?? []).length > 0 ? (
                        <span className="flex items-center gap-0.5">
                            {(task.assignees ?? []).slice(0, 3).map((user) => (
                                <span
                                    key={user.id}
                                    className={cn(
                                        'flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-semibold text-white ring-1 ring-background',
                                        getMemberColor(user),
                                    )}
                                >
                                    {getUserInitials(user)}
                                </span>
                            ))}

                            {(task.assignees ?? []).length > 3 && (
                                <span className="ml-0.5 text-[10px] text-muted-foreground">
                                    +{(task.assignees ?? []).length - 3}
                                </span>
                            )}
                        </span>
                    ) : (
                        <span className="text-muted-foreground">
                            Tambah Anggota Penugasan
                        </span>
                    )}
                </button>
            </PopoverTrigger>

            <PopoverContent align="start" className="w-52 p-1.5">
                <p className="mb-1 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Anggota Penugasan
                </p>

                <div className="space-y-0.5">
                    {TEAM_MEMBERS.map((user) => {
                        const assigned = (task.assignees ?? []).some((u) => u.id === user.id) || user.id === task.assignees?.[0]?.id;

                        return (
                            <button
                                key={user.id}
                                type="button"
                                onClick={() => onUpdate({ ...task, assignees: [...(task.assignees ?? []), user] })}
                                className={cn(
                                    'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors',
                                    assigned ? 'bg-primary/10' : 'hover:bg-muted',
                                )}
                            >
                                <span
                                    className={cn(
                                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white',
                                        getMemberColor(user))
                                    }
                                >
                                    {getUserInitials(user)}
                                </span>

                                <span className="flex-1 text-left">
                                    {user.name}
                                </span>

                                {assigned && <Check className="h-3 w-3 text-primary" />}
                            </button>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}