import { cn } from '@/lib/utils';
import { Circle, Plus, SquareKanban } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AddWorkflowAction({
    onAdd,
}: {
    onAdd: (name: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const cancelledRef = useRef(false);

    function handleOpen() {
        setName('');
        setOpen(true);
    }

    function handleSave() {
        const trimmed = name.trim();
        if (trimmed) {
            onAdd(trimmed);
        }
        setOpen(false);
        setName('');
    }

    function handleCancel() {
        cancelledRef.current = true;
        setOpen(false);
        setName('');
    }

    if (!open) {
        return (
            <div className="flex w-72 shrink-0 items-start">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5 border-dashed text-muted-foreground hover:text-foreground"
                    onClick={handleOpen}
                >
                    <Plus className="h-3.5 w-3.5" />
                    Tambah kolom
                </Button>
            </div>
        );
    }

    return (
        <div className="flex w-72 shrink-0 flex-col rounded-xl border border-border/60 bg-background shadow-md shadow-black/6">
            <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2.5">
                <Circle className="h-4 w-4 shrink-0 text-muted-foreground/50" />

                <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => {
                        if (!cancelledRef.current) handleSave();
                        cancelledRef.current = false;
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSave();
                        }
                        if (e.key === 'Escape') {
                            e.preventDefault();
                            handleCancel();
                        }
                    }}
                    placeholder="Nama kolom…"
                    className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/50"
                />
            </div>

            <div
                className={cn(
                    'flex flex-1 flex-col items-center justify-center gap-2 p-4 text-center',
                    'min-h-48',
                )}
            >
                <SquareKanban className="h-6 w-6 text-muted-foreground/20" />
                <p className="text-xs text-muted-foreground/50">
                    Kolom baru
                </p>
            </div>

            <div className="flex gap-1.5 p-2 pt-0">
                <Button
                    size="sm"
                    variant="ghost"
                    className="flex-1 text-muted-foreground"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleCancel();
                    }}
                >
                    Batalkan
                </Button>

                <Button
                    size="sm"
                    className="flex-1"
                    disabled={!name.trim()}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                >
                    Tambah
                </Button>
            </div>
        </div>
    );
}
