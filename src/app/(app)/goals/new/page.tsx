"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, Sparkles, Loader2, Target, Calendar } from "lucide-react";
import { toast } from "sonner";
import { GeneratingRoadmapModal } from "@/components/GeneratingRoadmapModal";
import { cn } from "@/lib/utils";

export default function NewGoalPage() {
  const router = useRouter();
  const [goalTitle, setGoalTitle] = useState("");
  const [timeframe, setTimeframe] = useState([30]);
  const [loading, setLoading] = useState(false);
  const [showGeneratingModal, setShowGeneratingModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!goalTitle.trim()) {
      toast.error("Please enter a goal title", { position: "top-center" });
      return;
    }

    setLoading(true);
    setShowGeneratingModal(true);

    try {
      // Call AI to generate roadmap
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal: goalTitle.trim(),
          timeframe_days: timeframe[0],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || 'Failed to generate roadmap';
        if (response.status === 401) {
          toast.error("Please sign in to create goals.");
          setShowGeneratingModal(false);
          setLoading(false);
          router.push("/login");
          return;
        }
        throw new Error(errorMsg);
      }

      // Success!
      setShowGeneratingModal(false);
      toast.success(`Roadmap created! ${data.tasks_count} tasks generated 🎉`);

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
    } catch (error) {
      setShowGeneratingModal(false);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate roadmap. Please try again.";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-background dark:to-background pointer-events-none" />

      <div className="w-full max-w-xl space-y-8 animate-in fade-in zoom-in-95 duration-500">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-xl shadow-indigo-500/30 ring-4 ring-white dark:ring-slate-900">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            What&apos;s your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">triumph?</span>
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
            Describe your ambition, and our AI will architect the perfect path to achieve it.
          </p>
        </div>

        {/* Main Card */}
        <Card className="glass-card overflow-visible">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Goal Title Input */}
              <div className="space-y-4">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Your Goal
                </label>
                <div className="relative group">
                  <Input
                    autoFocus
                    type="text"
                    placeholder="e.g. Learn Python, Run a Marathon, Master Chess..."
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    className="h-16 text-xl px-6 rounded-2xl bg-white/50 border-neutral-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm group-hover:shadow-md"
                  />
                </div>
              </div>

              {/* Timeframe Slider */}
              <div className="space-y-6 bg-neutral-50/80 dark:bg-neutral-900/50 p-6 rounded-2xl border border-neutral-100 dark:border-white/5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Timeline
                  </label>
                  <div className="flex items-baseline gap-1 bg-white dark:bg-black px-4 py-1 rounded-full shadow-sm">
                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {timeframe[0]}
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">days</span>
                  </div>
                </div>

                <div className="px-2">
                  <Slider
                    value={timeframe}
                    onValueChange={setTimeframe}
                    min={7}
                    max={180}
                    step={1}
                    className="py-4 cursor-pointer"
                  />
                </div>

                <div className="flex justify-between text-xs font-medium text-muted-foreground px-2">
                  <span>Fast Track (1 week)</span>
                  <span>Marathon (6 months)</span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || !goalTitle.trim()}
                size="lg"
                className={cn(
                  "w-full h-16 text-lg rounded-2xl shadow-xl shadow-indigo-500/20 transition-all duration-300",
                  !loading && goalTitle.trim() ? "hover:scale-[1.02] hover:shadow-indigo-500/40" : ""
                )}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Architecting your journey...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    <span>Generate Roadmap</span>
                    <ArrowRight className="h-5 w-5 ml-1 opacity-60" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
          Powered by advanced AI to create personalized, day-by-day learning schedules.
        </p>

        {/* Generating Modal */}
        <GeneratingRoadmapModal
          isOpen={showGeneratingModal}
          goalTitle={goalTitle}
        />
      </div>
    </div>
  );
}
