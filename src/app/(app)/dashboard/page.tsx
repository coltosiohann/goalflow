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
import { Target, Flame, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";

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

      // Auto-select the first goal if none selected, or restore from localStorage
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
    } catch (error: unknown) {
      const errorDetails =
        typeof error === "object" && error !== null
          ? (error as {
              message?: string;
              code?: string;
              details?: string;
              hint?: string;
            })
          : {};
      console.error("Error fetching goals:", error);
      console.error("Error details:", {
        message:
          error instanceof Error ? error.message : errorDetails.message,
        code: errorDetails.code,
        details: errorDetails.details,
        hint: errorDetails.hint,
      });
      toast.error("Failed to load goals");
    }
  };

  // Fetch data for the selected goal
  const fetchGoalData = async (goalId: string) => {
    try {
      setLoading(true);

      // Get today's tasks
      const tasks = await clientQueries.getTodaysTasks(goalId);
      setTodaysTasks(tasks);

      // Get goal progress
      const gProgress = await clientQueries.getGoalProgress(goalId);
      setGoalProgress(gProgress);

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

  // Initial load
  useEffect(() => {
    fetchGoals();
  }, []);

  // Load data when goal changes
  useEffect(() => {
    if (selectedGoalId) {
      fetchGoalData(selectedGoalId);
    }
  }, [selectedGoalId]);

  const handleCompleteTask = async () => {
    toast.success("Task completed! Great work! 🎉");
    // Refresh data
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
        {/* Active Goal with Selector */}
        <Card className="rounded-2xl border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {activeGoals.length > 1 ? 'Your Goals' : 'Active Goal'}
            </CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {activeGoals.length > 0 ? (
              <>
                {activeGoals.length > 1 ? (
                  <Select
                    value={selectedGoalId || ''}
                    onValueChange={(value) => {
                      setSelectedGoalId(value);
                      localStorage.setItem('selectedGoalId', value);
                    }}
                  >
                    <SelectTrigger className="mb-2 h-auto border-none p-0 shadow-none hover:bg-transparent">
                      <SelectValue>
                        <div className="text-left">
                          <div className="text-xl font-bold text-neutral-900">
                            {activeGoal?.title || 'Select a goal'}
                          </div>
                          <p className="mt-1 text-xs text-neutral-600">
                            {activeGoal?.timeframe_days} day challenge
                          </p>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {activeGoals.map((goal) => (
                        <SelectItem key={goal.id} value={goal.id}>
                          <div>
                            <div className="font-medium">{goal.title}</div>
                            <div className="text-xs text-neutral-500">
                              {goal.timeframe_days} days
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-neutral-900">
                      {activeGoal?.title}
                    </div>
                    <p className="mt-1 text-xs text-neutral-600">
                      {activeGoal?.timeframe_days} day challenge
                    </p>
                  </>
                )}
                {activeGoals.length > 1 && (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {activeGoals.length} active goals
                  </Badge>
                )}
              </>
            ) : (
              <div className="text-sm text-neutral-600">No active goals</div>
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
              const taskProgress = progress.find((p) => p.task_id === task.id);
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  completed={taskProgress?.completed ?? false}
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
