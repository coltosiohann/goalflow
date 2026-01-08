"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskCard } from "@/components/TaskCard";
import { TaskDrawer } from "@/components/TaskDrawer";
import { ProgressBar } from "@/components/ProgressBar";
import { EmptyState } from "@/components/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clientQueries, type Goal, type Task, type Progress } from "@/lib/supabase/queries";
import { Target, Flame, Calendar, Loader2, Trophy, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [activeGoals, setActiveGoals] = useState<Goal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [goalProgress, setGoalProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  // Get the currently selected goal
  const activeGoal = activeGoals.find(g => g.id === selectedGoalId) || null;

  // Fetch all goals
  const fetchGoals = async () => {
    try {
      const goals = await clientQueries.getActiveGoals();
      setActiveGoals(goals);

      if (goals.length > 0) {
        const savedGoalId = localStorage.getItem('selectedGoalId');
        const goalExists = savedGoalId && goals.some(g => g.id === savedGoalId);

        if (goalExists) {
          setSelectedGoalId(savedGoalId);
        } else {
          setSelectedGoalId(goals[0].id);
          localStorage.setItem('selectedGoalId', goals[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
      toast.error("Failed to load goals");
    }
  };

  // Fetch data for the selected goal
  const fetchGoalData = async (goalId: string) => {
    try {
      setLoading(true);
      const [tasks, gProgress, userProgress, userStreak] = await Promise.all([
        clientQueries.getTodaysTasks(goalId),
        clientQueries.getGoalProgress(goalId),
        clientQueries.getProgress(),
        clientQueries.getStreak()
      ]);

      setTodaysTasks(tasks);
      setGoalProgress(gProgress);
      setProgress(userProgress);
      setStreak(userStreak);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    if (selectedGoalId) {
      fetchGoalData(selectedGoalId);
    } else {
      setLoading(false);
    }
  }, [selectedGoalId]);

  const handleCompleteTask = async () => {
    toast.success("Task completed! Great work! 🎉");
    if (selectedGoalId) {
      await fetchGoalData(selectedGoalId);
    }
  };

  const currentTask = todaysTasks.find((t) => t.id === selectedTask);
  const isTaskCompleted = currentTask
    ? progress.find((p) => p.task_id === currentTask.id)?.completed ?? false
    : false;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
            <Loader2 className="relative h-12 w-12 animate-spin text-primary" />
          </div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading your flow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-white to-white dark:from-indigo-950/20 dark:via-background dark:to-background pointer-events-none" />

      <div className="container mx-auto space-y-8 px-4 py-8 md:py-12">
        {/* Header Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 backdrop-blur-sm dark:border-indigo-900/50 dark:bg-indigo-900/20 dark:text-indigo-300">
              <Sparkles className="h-3 w-3" />
              <span>Daily Focus</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Flow?</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              You&apos;re building momentum. Let&apos;s crush today&apos;s goals.
            </p>
          </div>

          {activeGoals.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Current Goal:</span>
              {activeGoals.length > 1 ? (
                <Select
                  value={selectedGoalId || ''}
                  onValueChange={(value) => {
                    setSelectedGoalId(value);
                    localStorage.setItem('selectedGoalId', value);
                  }}
                >
                  <SelectTrigger className="w-[200px] h-10 rounded-xl bg-white/50 border-white/40 shadow-sm backdrop-blur-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activeGoals.map((goal) => (
                      <SelectItem key={goal.id} value={goal.id}>
                        {goal.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="outline" className="h-9 px-4 text-sm bg-white/50 backdrop-blur-md border-indigo-100 text-indigo-700">
                  {activeGoal?.title}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Bento Grid Layout */}
        <div className="grid gap-6 md:grid-cols-12 md:grid-rows-[auto_auto]">

          {/* Main Progress Card (Large) */}
          <div className="md:col-span-8 md:row-span-2 group">
            <Card className="h-full relative overflow-hidden border-0 bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-500/20 rounded-[2rem]">
              <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-white/10 blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
              <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-700 delay-100"></div>

              <CardContent className="relative h-full flex flex-col justify-between p-8">
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-indigo-100 font-medium text-lg mb-1">Overall Progress</h3>
                      <p className="text-4xl md:text-5xl font-bold tracking-tight">{goalProgress}%</p>
                    </div>
                    <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-indigo-100/80">
                      <span>{goalProgress < 100 ? 'Keep pushing!' : 'Goal Achieved!'}</span>
                      <span>{goalProgress}/100</span>
                    </div>
                    <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                      <div
                        className="h-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${goalProgress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm text-indigo-100">Current Milestone</span>
                      <span className="text-xl font-semibold">Fundamentals</span>
                    </div>
                    {activeGoal && (
                      <Link href={`/goals/${activeGoal.id}`} className="group/btn flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-medium text-sm backdrop-blur-md">
                        Here&apos;s a clean view of your goal, streak, and today&apos;s
                        momentum.        <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Streak Card */}
          <div className="md:col-span-4">
            <Card className="h-full border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/20 dark:to-background overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Flame className="h-24 w-24 text-orange-500" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Flame className="h-5 w-5 fill-orange-500" />
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-neutral-900 dark:text-white">{streak}</span>
                  <span className="text-muted-foreground font-medium">days</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {streak > 2 ? "You&apos;re on fire! 🔥" : "Consistency is key."}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats / Info Card */}
          <div className="md:col-span-4">
            <Card className="h-full bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background border-blue-100/50">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Trophy className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                    🎯
                  </div>
                  <div>
                    <div className="font-bold text-neutral-900 dark:text-white">Goal Setter</div>
                    <div className="text-xs text-muted-foreground">First goal created</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Today's Tasks Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Today's Focus</h2>
            <div className="text-sm text-muted-foreground">
              {todaysTasks.length} tasks remaining
            </div>
          </div>

          <div className="grid gap-4">
            {todaysTasks.length > 0 ? (
              todaysTasks.map((task, i) => {
                const taskProgress = progress.find((p) => p.task_id === task.id);
                return (
                  <div key={task.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                    <TaskCard
                      task={task}
                      completed={taskProgress?.completed ?? false}
                      onOpen={() => setSelectedTask(task.id)}
                    />
                  </div>
                );
              })
            ) : (
              <EmptyState
                icon={Target}
                title="All caught up!"
                description={
                  activeGoal
                    ? "You&apos;ve crushed your goals for today. Take a break or plan ahead."
                    : "Start your journey by creating a new goal."
                }
                action={
                  !activeGoal
                    ? {
                      label: "Create New Goal",
                      onClick: () => (window.location.href = "/goals/new"),
                    }
                    : undefined
                }
              />
            )}
          </div>
        </div>

        {/* Task Drawer */}
        <TaskDrawer
          task={currentTask ?? null}
          completed={isTaskCompleted}
          open={selectedTask !== null}
          onOpenChange={(open) => !open && setSelectedTask(null)}
          onComplete={handleCompleteTask}
        />
      </div>
    </div>
  );
}
