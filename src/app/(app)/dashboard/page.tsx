"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskCard } from "@/components/TaskCard";
import { TaskDrawer } from "@/components/TaskDrawer";
import { ProgressBar } from "@/components/ProgressBar";
import { EmptyState } from "@/components/EmptyState";
import { clientQueries, type Goal, type Task, type Progress } from "@/lib/supabase/queries";
import { Target, Flame, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [goalProgress, setGoalProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);

      // Get active goal
      const goal = await clientQueries.getActiveGoal();
      setActiveGoal(goal);

      if (goal) {
        // Get today's tasks
        const tasks = await clientQueries.getTodaysTasks(goal.id);
        setTodaysTasks(tasks);

        // Get goal progress
        const gProgress = await clientQueries.getGoalProgress(goal.id);
        setGoalProgress(gProgress);
      }

      // Get user progress
      const userProgress = await clientQueries.getProgress();
      setProgress(userProgress);

      // Get streak
      const userStreak = await clientQueries.getStreak();
      setStreak(userStreak);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCompleteTask = async () => {
    toast.success("Task completed! Great work! 🎉");
    // Refresh data
    await fetchData();
  };

  const currentTask = todaysTasks.find((t) => t.id === selectedTask);
  const isTaskCompleted = currentTask
    ? progress.find((p) => p.task_id === currentTask.id)?.completed ?? false
    : false;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="mb-2 text-3xl font-bold text-neutral-900">
          Welcome back!
        </h1>
        <p className="text-neutral-600">
          Here&apos;s what you&apos;re working on today
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Active Goal */}
        <Card className="rounded-2xl border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goal</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {activeGoal ? (
              <>
                <div className="text-2xl font-bold text-neutral-900">
                  {activeGoal.title}
                </div>
                <p className="mt-1 text-xs text-neutral-600">
                  {activeGoal.timeframeDays} day challenge
                </p>
              </>
            ) : (
              <div className="text-sm text-neutral-600">No active goal</div>
            )}
          </CardContent>
        </Card>

        {/* Streak */}
        <Card className="rounded-2xl border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900">
              {streak} days
            </div>
            <p className="mt-1 text-xs text-neutral-600">Keep it up!</p>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card className="rounded-2xl border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900">
              {goalProgress}%
            </div>
            <p className="mt-1 text-xs text-neutral-600">Goal completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      {activeGoal && (
        <Card className="rounded-2xl border-2">
          <CardContent className="p-6">
            <ProgressBar
              label="Overall Progress"
              value={goalProgress}
              showPercentage
            />
          </CardContent>
        </Card>
      )}

      {/* Today's Tasks */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-900">
            Today&apos;s Tasks
          </h2>
          {activeGoal && (
            <Link
              href={`/goals/${activeGoal.id}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              View Roadmap
            </Link>
          )}
        </div>

        <div className="space-y-4">
          {todaysTasks.length > 0 ? (
            todaysTasks.map((task) => {
              const progress = getTaskProgress(task.id);
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  completed={progress?.completed ?? false}
                  onOpen={() => setSelectedTask(task.id)}
                />
              );
            })
          ) : (
            <EmptyState
              icon={Target}
              title="No tasks for today"
              description={
                activeGoal
                  ? "You've completed all tasks for today! Come back tomorrow."
                  : "Create a goal to get started with your learning journey."
              }
              action={
                !activeGoal
                  ? {
                      label: "Create Your First Goal",
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
  );
}
