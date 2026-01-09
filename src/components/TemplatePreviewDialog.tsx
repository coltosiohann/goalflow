"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowRight, CheckCircle2, Calendar, LayoutList } from "lucide-react";
import { toast } from "sonner";
import { type Template } from "@/data/templates";

interface TemplatePreviewDialogProps {
    template: Template | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TemplatePreviewDialog({ template, open, onOpenChange }: TemplatePreviewDialogProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    if (!template) return null;

    const Icon = template.icon;

    const handleStartJourney = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/clone-template', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ templateId: template.id }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to clone template');

            toast.success("Goal created successfully! Redirecting...");
            router.push(`/goals/${data.goalId}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to start this journey. Please try again.");
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-neutral-200/50">

                {/* Header - Sticked to top */}
                <div className="p-6 pb-4 border-b border-indigo-100/50 bg-indigo-50/30">
                    <div className="flex items-start gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
                            <Icon className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                            <DialogTitle className="text-2xl font-bold text-neutral-900">{template.title}</DialogTitle>
                            <DialogDescription className="text-base text-neutral-600 line-clamp-2">
                                {template.description}
                            </DialogDescription>
                            <div className="flex items-center gap-2 pt-1">
                                <Badge variant="secondary" className="bg-white/50 backdrop-blur-sm border-indigo-100">{template.difficulty}</Badge>
                                <div className="flex items-center gap-1 text-xs font-medium text-neutral-500">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {template.duration} Days
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-8">
                        {/* Roadmap Preview */}
                        <div className="space-y-4">
                            <h4 className="flex items-center gap-2 font-semibold text-neutral-900">
                                <LayoutList className="h-4 w-4 text-indigo-500" />
                                Roadmap Overview
                            </h4>

                            <div className="relative pl-6 border-l-2 border-indigo-100 space-y-8">
                                {template.milestones.length > 0 ? (
                                    template.milestones.map((milestone, i) => (
                                        <div key={i} className="relative">
                                            <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full border-2 border-indigo-500 bg-white" />
                                            <div className="space-y-2">
                                                <div className="flex items-baseline justify-between">
                                                    <span className="font-semibold text-neutral-800">{milestone.title}</span>
                                                    <span className="text-xs text-neutral-400 font-mono">Day {milestone.day_start}-{milestone.day_end}</span>
                                                </div>
                                                <div className="space-y-1">
                                                    {milestone.tasks.slice(0, 3).map((task, tIndex) => (
                                                        <div key={tIndex} className="flex items-start gap-2 text-sm text-neutral-600">
                                                            <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-indigo-300 shrink-0" />
                                                            <span>{task.title}</span>
                                                        </div>
                                                    ))}
                                                    {milestone.tasks.length > 3 && (
                                                        <p className="text-xs text-indigo-600 pl-5 pt-1 italic">
                                                            + {milestone.tasks.length - 3} more tasks
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 rounded-xl bg-neutral-50 border border-dashed border-neutral-200 text-center text-sm text-neutral-500">
                                        Detailed milestones coming soon for this template.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer - Sticked to bottom */}
                <DialogFooter className="p-6 pt-4 border-t border-neutral-100 bg-white dark:bg-slate-900">
                    <Button
                        onClick={onOpenChange.bind(null, false)}
                        variant="outline"
                        className="rounded-xl"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleStartJourney}
                        disabled={loading}
                        className="rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Setting up...
                            </>
                        ) : (
                            <>
                                Start This Journey
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}
