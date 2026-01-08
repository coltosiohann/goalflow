"use client";

import { useState, useEffect, useCallback } from "react";
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
import { ArrowLeft, Target, Calendar, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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
      const details =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : JSON.stringify(err);
      console.error("Error fetching goal data:", details);
      setError("Failed to load goal data");
    } finally {
      setLoading(false);
    }
  }, [goalId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTaskComplete = () => {
    // Refresh data after task completion
    fetchData();
  };

  const handleDeleteGoal = async () => {
    try {
      await clientQueries.deleteGoal(goalId);
      toast.success("Goal deleted successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast.error("Failed to delete goal");
    }
  };

  const handleGenerateNextWeek = async () => {
    try {
      setGeneratingNextWeek(true);
      const response = await fetch("/api/generate-next-week", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal_id: goalId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate next week");
      }
      toast.success("Next week generated successfully");
      await fetchData();
    } catch (error) {
      console.error("Error generating next week:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate next week"
      );
    } finally {
      setGeneratingNextWeek(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-neutral-600">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="mb-2 text-xl font-bold text-neutral-900">
              {error || "Goal not found"}
            </h2>
            <p className="mb-4 text-sm text-neutral-600">
              This goal doesn&apos;t exist or you don&apos;t have access to it.
            </p>
            <Link href="/dashboard">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate current day
  const startDate = new Date(goal.created_at);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const currentDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const dayNumber = Math.min(currentDay, goal.timeframe_days);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center text-sm font-medium text-neutral-600 hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h1 className="text-3xl font-bold text-neutral-900">{goal.title}</h1>
              <Badge variant="default">{goal.status}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-neutral-600">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Day {dayNumber} of {goal.timeframe_days}
              </span>
              <span className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {goalProgress}% Complete
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleGenerateNextWeek}
              disabled={generatingNextWeek}
            >
              {generatingNextWeek ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Next Week"
              )}
            </Button>

            {/* Delete Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Goal
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete &quot;{goal.title}&quot; and all associated milestones, tasks, resources, and progress. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteGoal}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="mt-4">
          <ProgressBar label="Overall Progress" value={goalProgress} showPercentage />
        </div>
      </div>

      {/* Milestones and Tasks */}
      <div className="space-y-6">
        {milestones.map((milestone) => {
          const milestoneTasks = tasks.filter((t) => t.milestone_id === milestone.id);
          const completedCount = milestoneTasks.filter((t) =>
            progress.some((p) => p.task_id === t.id && p.completed)
          ).length;
          const milestoneProgress = milestoneTasks.length > 0
            ? Math.round((completedCount / milestoneTasks.length) * 100)
            : 0;

          return (
            <Card key={milestone.id} className="rounded-2xl border-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{milestone.title}</CardTitle>
                    <p className="mt-1 text-sm text-neutral-600">
                      Days {milestone.day_start} - {milestone.day_end}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-4">
                    {completedCount}/{milestoneTasks.length} tasks
                  </Badge>
                </div>
                <div className="mt-3">
                  <ProgressBar
                    label={`${completedCount} of ${milestoneTasks.length} tasks completed`}
                    value={milestoneProgress}
                    showPercentage
                  />
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {milestoneTasks.map((task) => {
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

                  {milestoneTasks.length === 0 && (
                    <p className="py-8 text-center text-sm text-neutral-500">
                      No tasks in this milestone
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {milestones.length === 0 && (
          <Card className="rounded-2xl border-2">
            <CardContent className="py-12 text-center">
              <p className="text-neutral-500">
                No milestones found for this goal
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Task Drawer */}
      {selectedTask && (
        <TaskDrawer
          task={tasks.find(t => t.id === selectedTask) ?? null}
          completed={progress.some(p => p.task_id === selectedTask && p.completed)}
          open={true}
          onOpenChange={(open) => {
            if (!open) setSelectedTask(null);
          }}
          onComplete={handleTaskComplete}
        />
      )}
    </div>
  );
}
