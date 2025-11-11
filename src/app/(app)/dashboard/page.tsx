"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskCard } from "@/components/TaskCard";
import { TaskDrawer } from "@/components/TaskDrawer";
import { ProgressBar } from "@/components/ProgressBar";
import { EmptyState } from "@/components/EmptyState";
import {
  mockGoals,
  getTodaysTasks,
  getTaskProgress,
  getGoalProgress,
  getStreak,
} from "@/lib/mock";
import { Target, Flame, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Get active goal and today's tasks
  const activeGoal = mockGoals.find((g) => g.status === "active");
  const todaysTasks = activeGoal ? getTodaysTasks(activeGoal.id) : [];
  const goalProgress = activeGoal ? getGoalProgress(activeGoal.id) : 0;
  const streak = getStreak();

  const handleCompleteTask = () => {
    toast.success("Task completed! Great work! 🎉");
    // Force refresh to show updated completion status
    setRefreshKey(prev => prev + 1);
  };

  const currentTask = todaysTasks.find((t) => t.id === selectedTask);
  const isTaskCompleted = currentTask
    ? getTaskProgress(currentTask.id)?.completed ?? false
    : false;

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
