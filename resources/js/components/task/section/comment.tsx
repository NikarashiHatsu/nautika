import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Task } from "@/types";
import { MessageSquare, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type MockComment = {
    id: string;
    authorName: string;
    authorInitials: string;
    authorColor: string;
    text: string;
    createdAt: Date;
    isOwn: boolean;
};

const CURRENT_USER = { name: 'Kamu', initials: 'KM', color: 'bg-primary' };

const MOCK_COMMENT_TEXTS = [
    'Sudah di-review, ada beberapa hal yang perlu diperbaiki.',
    'Oke, akan saya perbaiki segera!',
    'Apakah sudah bisa di-deploy ke staging?',
    'Perlu koordinasi dulu dengan tim desain.',
    'Done, silakan di-review kembali.',
    'Ini sudah sesuai dengan requirement yang ada di dokumen.',
    'Ada edge case yang belum ditangani di sini.',
    'LGTM! Bisa di-merge.',
];

type TeamMember = {
    id: number;
    initials: string;
    name: string;
    email: string;
    color: string;
};

const TEAM_MEMBERS: TeamMember[] = [
    { id: 10, initials: 'BS', name: 'Budi Santoso',   email: 'bs@example.com', color: 'bg-blue-500' },
    { id: 11, initials: 'AW', name: 'Ani Wijaya',     email: 'aw@example.com', color: 'bg-violet-500' },
    { id: 12, initials: 'RP', name: 'Reza Pratama',   email: 'rp@example.com', color: 'bg-green-500' },
    { id: 13, initials: 'DK', name: 'Dewi Kusuma',    email: 'dk@example.com', color: 'bg-rose-500' },
    { id: 14, initials: 'HG', name: 'Hendra Gunawan', email: 'hg@example.com', color: 'bg-amber-500' },
    { id: 15, initials: 'AR', name: 'Adi Rahardian',  email: 'ar@example.com', color: 'bg-cyan-500' },
    { id: 16, initials: 'FS', name: 'Fajar Setiawan', email: 'fs@example.com', color: 'bg-orange-500' },
    { id: 17, initials: 'NR', name: 'Nadia Rahma',    email: 'nr@example.com', color: 'bg-pink-500' },
];

const MOCK_AUTHORS = TEAM_MEMBERS.slice(0, 5);

function generateMockComments(count: number): MockComment[] {
    if (count === 0) return [];
    const now = Date.now();
    return Array.from({ length: Math.min(count, MOCK_COMMENT_TEXTS.length) }, (_, i) => {
        const author = MOCK_AUTHORS[i % MOCK_AUTHORS.length];
        return {
            id: `mock-${i}`,
            authorName: author.name,
            authorInitials: author.initials,
            authorColor: author.color,
            text: MOCK_COMMENT_TEXTS[i],
            createdAt: new Date(now - (count - i) * 3_600_000 * 2),
            isOwn: false,
        };
    });
}

function formatRelativeTime(date: Date): string {
    const diffSec  = Math.floor((Date.now() - date.getTime()) / 1000);
    const diffMin  = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay  = Math.floor(diffHour / 24);
    if (diffSec < 60)  return 'Baru saja';
    if (diffMin < 60)  return `${diffMin} menit lalu`;
    if (diffHour < 24) return `${diffHour} jam lalu`;
    if (diffDay < 7)   return `${diffDay} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export default function TaskSectionComment({
    task,
    onUpdate,
}: {
    task: Task;
    onUpdate: (task: Task) => void;
}) {
    const [commentList, setCommentList] = useState<MockComment[]>(() => generateMockComments(task.comments_count ?? 0));
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingCommentText, setEditingCommentText] = useState('');
    const [commentDraft, setCommentDraft] = useState('');

    const commentTextareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setCommentList(generateMockComments(task.comments_count ?? 0));
    }, [task.id]);

    function deleteComment(id: string) {
        setCommentList((prev) => prev.filter((c) => c.id !== id));
    }

    function saveCommentEdit(id: string) {
        const trimmed = editingCommentText.trim();

        if (trimmed) {
            setCommentList((prev) => prev.map((c) => c.id === id ? { ...c, text: trimmed } : c));
        }

        setEditingCommentId(null);
    }

    function submitComment() {
        const trimmed = commentDraft.trim();

        if (!trimmed) return;

        setCommentList((prev) => [
            ...prev,
            {
                id: `comment-${Date.now()}`,
                authorName: CURRENT_USER.name,
                authorInitials: CURRENT_USER.initials,
                authorColor: CURRENT_USER.color,
                text: trimmed,
                createdAt: new Date(),
                isOwn: true,
            },
        ]);

        setCommentDraft('');

        onUpdate({ ...task, comments_count: commentList.length + 1 });
    }

    return (
        <div>
            <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" />
                Komentar
                {commentList.length > 0 && (
                    <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] tabular-nums leading-none">
                        {commentList.length}
                    </span>
                )}
            </div>

            {commentList.length > 0 && (
                <div className="mb-3 space-y-3 overflow-y-auto pr-1">
                    {commentList.map((comment) => (
                        <div key={comment.id} className="group/comment flex gap-2.5">
                            <div
                                className={cn(
                                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white',
                                    comment.authorColor
                                )}
                            >
                                {comment.authorInitials}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold leading-none">
                                        {comment.authorName}
                                    </span>

                                    <span className="text-[10px] text-muted-foreground leading-none">
                                        {formatRelativeTime(comment.createdAt)}
                                    </span>

                                    {comment.isOwn && editingCommentId !== comment.id && (
                                        <div className="ml-auto flex items-center gap-0.5 opacity-0 transition-opacity group-hover/comment:opacity-100">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingCommentId(comment.id);
                                                    setEditingCommentText(comment.text);
                                                }}
                                                className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground/60 hover:text-foreground transition-colors"
                                            >
                                                <Pencil className="h-3 w-3" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => deleteComment(comment.id)}
                                                className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground/60 hover:text-destructive transition-colors"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {
                                    editingCommentId === comment.id
                                        ? (
                                            <div className="mt-1.5 space-y-1.5">
                                                <Textarea
                                                    autoFocus
                                                    value={editingCommentText}
                                                    onChange={(e) => setEditingCommentText(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            saveCommentEdit(comment.id);
                                                        }

                                                        if (e.key === 'Escape') setEditingCommentId(null);
                                                    }}
                                                    className="min-h-16 text-xs"
                                                />

                                                <div className="flex gap-1.5">
                                                    <Button
                                                        size="sm"
                                                        className="h-6 px-2.5 text-xs"
                                                        onClick={() => saveCommentEdit(comment.id)}
                                                    >Simpan</Button>

                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-6 px-2 text-xs"
                                                        onClick={() => setEditingCommentId(null)}
                                                    >Batal</Button>
                                                </div>
                                            </div>
                                        )
                                        : (
                                            <p className="mt-1 text-xs leading-relaxed text-foreground/90">{comment.text}</p>
                                        )
                                }
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex gap-2.5">
                <div
                    className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white',
                        CURRENT_USER.color
                    )}>
                    {CURRENT_USER.initials}
                </div>

                <div className="min-w-0 flex-1 space-y-1.5">
                    <Textarea
                        ref={commentTextareaRef}
                        value={commentDraft}
                        onChange={(e) => setCommentDraft(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                submitComment();
                            }
                        }}
                        placeholder="Tulis komentar... (Tekan Enter untuk kirim)"
                        className="min-h-[68px] resize-none text-xs"
                    />

                    {commentDraft.trim() && (
                        <div className="flex justify-end">
                            <Button size="sm" className="h-7 px-3 text-xs" onClick={submitComment}>
                                Kirim
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}