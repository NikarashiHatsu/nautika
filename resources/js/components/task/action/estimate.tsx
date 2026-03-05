import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Task } from "@/types";
import { Clock } from "lucide-react";
import { useState } from "react";

export default function TaskActionEstimate({
    task,
    onUpdate,
}: {
    task: Task;
    onUpdate: (task: Task) => void;
}) {
    const [estimateOpen, setEstimateOpen] = useState(false);
    const [estimateDraft, setEstimateDraft] = useState('');

    const ESTIMATE_PRESETS = [
        { label: '15m', minutes: 15  },
        { label: '30m', minutes: 30  },
        { label: '1j',  minutes: 60  },
        { label: '2j',  minutes: 120 },
        { label: '4j',  minutes: 240 },
        { label: '8j',  minutes: 480 },
    ];

    function formatEstimate(minutes: number): string {
        if (minutes <= 0) return '';

        const h = Math.floor(minutes / 60);
        const m = minutes % 60;

        if (h === 0) return `${m}m`;
        if (m === 0) return `${h}j`;
        return `${h}j ${m}m`;
    }

    return (
        <Popover
            open={estimateOpen}
            onOpenChange={(open) => {
                setEstimateOpen(open);
                if (open) setEstimateDraft(String(task.estimate_minutes ?? ''));
            }}
        >
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md bg-muted px-2.5 py-1.5 text-xs transition-colors hover:bg-muted/80"
                >
                    <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

                    {task.estimate_minutes
                        ? <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                            {formatEstimate(task.estimate_minutes)}
                        </Badge>
                        : <span className="text-muted-foreground">
                            Tambah estimasi
                        </span>
                    }
                </button>
            </PopoverTrigger>

            <PopoverContent align="start" className="w-52 p-3">
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Estimasi waktu
                </p>

                <div className="mb-3 flex flex-wrap gap-1">
                    {ESTIMATE_PRESETS.map((preset) => (
                        <button
                            key={preset.label}
                            type="button"
                            onClick={() => setEstimateDraft(String(preset.minutes))}
                            className={cn(
                                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                                estimateDraft === String(preset.minutes)
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted hover:bg-muted/80',
                            )}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>

                <div className="mb-3 flex items-center gap-1.5">
                    <input
                        type="number"
                        min="1"
                        value={estimateDraft}
                        onChange={(e) => setEstimateDraft(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const mins = parseInt(estimateDraft);
                                if (mins > 0) {
                                    onUpdate({ ...task, estimate_minutes: mins });
                                    setEstimateOpen(false);
                                }
                            }
                        }}
                        placeholder="Kustom…"
                        className="min-w-0 flex-1 rounded-md border border-border bg-transparent px-2.5 py-1 text-xs outline-none ring-ring focus:ring-2"
                    />

                    <span className="shrink-0 text-xs text-muted-foreground">
                        menit
                    </span>
                </div>

                {parseInt(estimateDraft) > 0 && (
                    <p className="mb-2 text-[11px] text-muted-foreground">
                        = <span className="font-medium text-foreground">{formatEstimate(parseInt(estimateDraft))}</span>
                    </p>
                )}

                <div className="flex gap-1.5">
                    <Button
                        size="sm"
                        className="h-7 flex-1 text-xs"
                        disabled={!(parseInt(estimateDraft) > 0)}
                        onClick={() => {
                            const mins = parseInt(estimateDraft);
                            if (mins > 0) {
                                onUpdate({ ...task, estimate_minutes: mins });
                                setEstimateOpen(false);
                            }
                        }}
                    >
                        Simpan
                    </Button>

                    {task.estimate_minutes && (
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs"
                            onClick={() => {
                                onUpdate({ ...task, estimate_minutes: undefined });
                                setEstimateOpen(false);
                            }}
                        >
                            Hapus
                        </Button>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}