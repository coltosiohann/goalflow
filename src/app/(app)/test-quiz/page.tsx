"use client";

import { useState, useEffect } from "react";
import { TaskDrawer } from "@/components/TaskDrawer";
import { clientQueries, type Task, type Progress } from "@/lib/supabase/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function TestQuizPage() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const activeGoal = await clientQueries.getActiveGoal();
        if (activeGoal) {
          const goalTasks = await clientQueries.getTasks(activeGoal.id);
          setTasks(goalTasks);
        }
        const userProgress = await clientQueries.getProgress();
        setProgress(userProgress);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;
  const isCompleted = selectedTask
    ? progress.find((p) => p.task_id === selectedTask.id)?.completed ?? false
    : false;

  const handleCompleteTask = async () => {
    toast.success("Task completed! Great work! 🎉");
    // Refetch progress
    try {
      const userProgress = await clientQueries.getProgress();
      setProgress(userProgress);
    } catch (error) {
      console.error('Error refreshing progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Find task-7 or any task with a quiz
  const quizTask = tasks.find((t) => t.quiz && Array.isArray(t.quiz) && t.quiz.length > 0);

  return (
    <div className="container mx-auto max-w-2xl space-y-6 py-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-neutral-900">
          Quiz Testing Page
        </h1>
        <p className="text-neutral-600">
          Click the button below to test the quiz feature
        </p>
      </div>

      <Card className="rounded-2xl border-2">
        <CardContent className="p-6">
          {quizTask ? (
            <>
              <h2 className="mb-4 text-lg font-semibold text-neutral-900">
                {quizTask.title}
              </h2>
              <p className="mb-4 text-sm text-neutral-600">
                This task has a quiz with {quizTask.quiz.length} questions. You must score 80% or higher
                to complete it.
              </p>
              <Button
                onClick={() => setSelectedTaskId(quizTask.id)}
                className="rounded-xl"
              >
                Open Task (With Quiz)
              </Button>
            </>
          ) : (
            <div className="text-center">
              <p className="mb-4 text-neutral-600">
                No tasks with quizzes found. Please add tasks with quizzes to your goal.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-2 bg-amber-50">
        <CardContent className="p-6">
          <h3 className="mb-2 font-semibold text-amber-900">
            Debug Instructions
          </h3>
          <ol className="list-inside list-decimal space-y-1 text-sm text-amber-800">
            <li>Open your browser console (F12 → Console tab)</li>
            <li>Click the button above to open task-7</li>
            <li>Check the console for debug messages</li>
            <li>Scroll down in the drawer to see all sections</li>
            <li>Look for the "Knowledge Check" section with quiz</li>
          </ol>
        </CardContent>
      </Card>

      {/* Task Drawer */}
      <TaskDrawer
        task={selectedTask ?? null}
        completed={isCompleted}
        open={selectedTaskId !== null}
        onOpenChange={(open) => !open && setSelectedTaskId(null)}
        onComplete={handleCompleteTask}
      />
    </div>
  );
}
