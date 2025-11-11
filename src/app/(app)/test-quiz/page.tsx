"use client";

import { useState } from "react";
import { TaskDrawer } from "@/components/TaskDrawer";
import { mockTasks, getTaskProgress } from "@/lib/mock";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function TestQuizPage() {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Get task-7 which has the quiz
  const task7 = mockTasks.find((t) => t.id === "task-7");
  const selectedTask = mockTasks.find((t) => t.id === selectedTaskId);
  const isCompleted = selectedTask
    ? getTaskProgress(selectedTask.id)?.completed ?? false
    : false;

  const handleCompleteTask = () => {
    toast.success("Task completed! Great work! 🎉");
  };

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
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Task 7: Build a Simple Quiz App
          </h2>
          <p className="mb-4 text-sm text-neutral-600">
            This task has a quiz with 5 questions. You must score 80% or higher
            to complete it.
          </p>
          <Button
            onClick={() => setSelectedTaskId("task-7")}
            className="rounded-xl"
          >
            Open Task 7 (With Quiz)
          </Button>
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
