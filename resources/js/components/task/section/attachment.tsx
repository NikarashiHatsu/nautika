import { cn } from "@/lib/utils";
import { Task } from "@/types";
import { FileIcon, FileText, Film, ImageIcon, Paperclip, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type MockAttachment = {
    id: string;
    name: string;
    size: number;
    mimeType: string;
    caption: string;
    url?: string;
};

const MOCK_ATTACHMENT_FILES: Pick<MockAttachment, 'name' | 'size' | 'mimeType'>[] = [
    { name: 'design-mockup-v2.png',  size: 2_400_000, mimeType: 'image/png'          },
    { name: 'requirements.pdf',      size:   540_000,  mimeType: 'application/pdf'    },
    { name: 'api-spec.json',         size:    12_000,  mimeType: 'application/json'   },
    { name: 'demo-video.mp4',        size: 15_000_000, mimeType: 'video/mp4'          },
    { name: 'database-schema.sql',   size:     8_500,  mimeType: 'text/plain'         },
    { name: 'test-report.xlsx',      size:   320_000,  mimeType: 'application/excel'  },
];

function generateMockAttachments(count: number): MockAttachment[] {
    return Array.from({ length: Math.min(count, MOCK_ATTACHMENT_FILES.length) }, (_, i) => ({
        id: `att-${i}`,
        ...MOCK_ATTACHMENT_FILES[i],
        caption: '',
    }));
}

export default function TaskSectionAttachment({
    task,
    onUpdate,
}: {
    task: Task;
    onUpdate: (task: Task) => void;
}) {
    const [attachments, setAttachments] = useState<MockAttachment[]>(() => generateMockAttachments(task.attachments_count ?? 0));
    const [isDragging, setIsDragging] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setAttachments(generateMockAttachments(task.attachments_count ?? 0));
    }, [task.attachments_count]);

    function getAttachmentIcon(mimeType: string): React.ComponentType<{ className?: string }> {
        if (mimeType.startsWith('image/')) return ImageIcon;
        if (mimeType.startsWith('video/')) return Film;
        if (mimeType === 'application/pdf') return FileText;
        return FileIcon;
    }

    function formatFileSize(bytes: number): string {
        if (bytes < 1_024) return `${bytes} B`;
        if (bytes < 1_048_576) `${(bytes / 1_024).toFixed(1)} KB`;
        return `${(bytes / 1_048_576).toFixed(1)} MB`;
    }

    function removeAttachment(id: string) {
        const updated = attachments.filter((attachment) => attachment.id !== id);
        setAttachments(updated);
        onUpdate({ ...task, attachments_count: updated.length > 0 ? updated.length : undefined });
    }

    function updateCaption(id: string, caption: string) {
        setAttachments((prev) => prev.map((a) => a.id === id ? { ...a, caption } : a));
    }

    function addFiles(files: FileList | null) {
        if (!files || files.length === 0) return;

        const incoming: MockAttachment[] = Array.from(files).map((file) => ({
            id: `att-${Date.now()}-${file.name}`,
            name: file.name,
            size: file.size,
            mimeType: file.type || 'application/octet-stream',
            caption: '',
            url: URL.createObjectURL(file),
        }));

        const updated = [...attachments, ...incoming];

        setAttachments(updated);

        onUpdate({ ...task, attachments_count: updated.length });
    }

    return (
        <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Paperclip className="h-3.5 w-3.5" />
                Lampiran
                {attachments.length > 0 && (
                    <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] tabular-nums leading-none">
                        {attachments.length}
                    </span>
                )}
            </div>

            {attachments.length > 0 && (
                <div className="mb-2 space-y-2">
                    {attachments.map((attachment) => {
                        const Icon = getAttachmentIcon(attachment.mimeType);
                        return (
                            <div key={attachment.id} className="group/att rounded-lg border border-border p-2.5 space-y-1.5">
                                <div className="flex items-start gap-2">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                                        <Icon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-medium leading-snug">{attachment.name}</p>
                                        <p className="text-[10px] text-muted-foreground">{formatFileSize(attachment.size)}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeAttachment(attachment.id)}
                                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground/40 opacity-0 transition-opacity hover:text-destructive group-hover/att:opacity-100"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={attachment.caption}
                                    onChange={(e) => updateCaption(attachment.id, e.target.value)}
                                    placeholder="Tambahkan keterangan… (opsional)"
                                    className="w-full rounded-md border-0 bg-muted px-2 py-1 text-[11px] outline-none placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-ring"
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            <div
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    addFiles(e.dataTransfer.files);
                }}
                className={cn(
                    'flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-2 border-dashed px-4 py-4 text-center transition-colors',
                    isDragging
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40 hover:bg-muted/50',
                )}
            >
                <Upload className="h-4 w-4" />
                <p className="text-xs font-medium">Klik atau seret file ke sini</p>
                <p className="text-[10px]">Semua format didukung</p>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
            />
        </div>
    );
}