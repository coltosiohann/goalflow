"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";
import { TaskCard } from "@/components/TaskCard";
import { TaskDrawer } from "@/components/TaskDrawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { clientQueries, type Goal, type Milestone, type Task, type Progress } from "@/lib/supabase/queries";
import { ArrowLeft, Target, Calendar, Loader2, Trash2, MoreVertical, Flag, Map } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function GoalOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const goalId = params.goalId as string;

  const [goal, setGoal] = useState<Goal | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [goalProgress, setGoalProgress] = useState(0);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingNextWeek, setGeneratingNextWeek] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch goal
      const goals = await clientQueries.getGoals();
      const currentGoal = goals.find(g => g.id === goalId);

      if (!currentGoal) {
        setError("Goal not found");
        setLoading(false);
        return;
      }

      setGoal(currentGoal);

      // Fetch milestones, tasks, and progress
      const [milestonesData, tasksData, progressData, gProgress] = await Promise.all([
        clientQueries.getMilestones(goalId),
        clientQueries.getTasks(goalId),
        clientQueries.getProgress(),
        clientQueries.getGoalProgress(goalId),
      ]);

      setMilestones(milestonesData);
      setTasks(tasksData);
      setProgress(progressData);
      setGoalProgress(gProgress);
    } catch (err) {
      console.error("Error fetching goal data:", err);
      setError("Failed to load goal data");
    } finally {
      setLoading(false);
    }
  }, [goalId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const dayNumber = useMemo(() => {
    if (!goal) return 1;
    const startDate = new Date(goal.created_at);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const currentDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.min(currentDay, goal.timeframe_days);
  }, [goal]);

  const weekStart = useMemo(() => dayNumber, [dayNumber]);
  const weekEnd = useMemo(
    () => (goal ? Math.min(dayNumber + 6, goal.timeframe_days) : dayNumber),
    [dayNumber, goal]
  );

  const handleTaskComplete = () => {
    fetchData();
  };

  const handleDeleteGoal = async () => {
    try {
      await clientQueries.deleteGoal(goalId);
      toast.success("Goal deleted successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete goal");
    }
  };

  const handleGenerateNextWeek = async () => {
    try {
      setGeneratingNextWeek(true);
      const response = await fetch("/api/generate-next-week", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal_id: goalId,
          feedback: null, // Feedback simplified for this version
        }),
      });
      if (!response.ok) {
        throw new Error("Failed");
      }
      toast.success("Next week generated successfully");
      await fetchData();
    } catch (error) {
      toast.error("Failed to generate next week");
    } finally {
      setGeneratingNextWeek(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
            <Loader2 className="relative h-12 w-12 animate-spin text-primary" />
          </div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="glass-card max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
              <Flag className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Goal Not Found</h2>
              <p className="text-neutral-500 mt-2">The goal you are looking for does not exist or has been deleted.</p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate current week tasks
  const weekTasks = tasks.filter(
    (task) => task.day_number >= weekStart && task.day_number <= weekEnd
  );

  const weekTasksByDay: Record<number, Task[]> = {};
  weekTasks.forEach((task) => {
    const key = task.day_number;
    if (!weekTasksByDay[key]) {
      weekTasksByDay[key] = [];
    }
    weekTasksByDay[key].push(task);
  });

  return (
    <div className="min-h-screen pb-20">
      {/* Header Background */}
      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-background pointer-events-none -z-10" />

      <div className="container mx-auto space-y-8 px-4 py-8">
        {/* Navigation & Header */}
        <div className="space-y-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors hover:-translate-x-1 duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant={goal.status === 'active' ? 'default' : 'secondary'} className="uppercase tracking-wider font-semibold text-[10px] px-2 py-0.5">
                  {goal.status}
                </Badge>
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {goal.timeframe_days} Days Challenge
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-2">
                {goal.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Map className="h-4 w-4 text-indigo-500" />
                  Day {dayNumber}
                </span>
                <span className="h-1 w-1 rounded-full bg-neutral-300" />
                <span className="flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-emerald-500" />
                  {goalProgress}% Complete
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleGenerateNextWeek}
                disabled={generatingNextWeek}
                className="bg-white/80 hover:bg-white text-indigo-600 border border-indigo-100 shadow-sm backdrop-blur-sm"
              >
                {generatingNextWeek ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Planning...
                  </>
                ) : (
                  <>Generate Next Week</>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Goal
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this goal?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. All progress will be lost.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteGoal} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Progress Bar Header */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/40 shadow-sm">
            <ProgressBar label="Total Progress" value={goalProgress} showPercentage />
          </div>
        </div>

        {/* Current Focus Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Current Focus</h2>
            <Badge variant="outline" className="px-3 py-1">Days {weekStart} - {weekEnd}</Badge>
          </div>

          {weekTasks.length === 0 ? (
            <Card className="border-dashed border-2 bg-neutral-50/50">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500 mb-4">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-1">No tasks scheduled</h3>
                <p className="text-muted-foreground mb-4 max-w-sm">
                  You&apos;re all caught up for this period. Ready to plan the next phase?
                </p>
                <Button onClick={handleGenerateNextWeek} disabled={generatingNextWeek}>
                  {generatingNextWeek ? "Generating..." : "Generate Next Week"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {Array.from({ length: weekEnd - weekStart + 1 }, (_, idx) => {
                const day = weekStart + idx;
                const dayTasks = weekTasksByDay[day] || [];
                if (dayTasks.length === 0) return null;

                return (
                  <div key={day} className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground pl-1">Day {day}</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {dayTasks.map((task) => {
                        const taskProgress = progress.find((p) => p.task_id === task.id);
                        return (
                          <TaskCard
                            key={task.id}
                            task={task}
                            completed={taskProgress?.completed ?? false}
                            onOpen={() => setSelectedTask(task.id)}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Milestones Section */}
        <section className="space-y-6 pt-8 border-t border-neutral-100">
          <h2 className="text-2xl font-bold tracking-tight">Milestones</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {milestones.length > 0 ? (
              milestones.map((milestone) => {
                const milestoneTasks = tasks.filter((t) => t.milestone_id === milestone.id);
                const completedCount = milestoneTasks.filter((t) =>
                  progress.some((p) => p.task_id === t.id && p.completed)
                ).length;
                const milestoneProgress = milestoneTasks.length > 0
                  ? Math.round((completedCount / milestoneTasks.length) * 100)
                  : 0;

                return (
                  <Card key={milestone.id} className="glass-card hover:border-indigo-200 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="bg-white/50">Days {milestone.day_start}-{milestone.day_end}</Badge>
                        <span className="text-sm font-medium text-muted-foreground">{completedCount}/{milestoneTasks.length} Done</span>
                      </div>
                      <CardTitle className="text-lg">{milestone.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ProgressBar label="" value={milestoneProgress} showPercentage={false} className="h-2" />
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <div className="col-span-full py-8 text-center text-muted-foreground">
                No milestones defined.
              </div>
            )}
          </div>
        </section>

        {/* Task Drawer */}
        <TaskDrawer
          task={tasks.find(t => t.id === selectedTask) ?? null}
          completed={progress.some(p => p.task_id === selectedTask && p.completed)}
          open={selectedTask !== null}
          onOpenChange={(open) => !open && setSelectedTask(null)}
          onComplete={handleTaskComplete}
        />
      </div>
    </div>
  );
}
