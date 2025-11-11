"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { mockTasks, getTaskProgress, type TaskType } from "@/lib/mock";
import { ArrowLeft, ExternalLink, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const taskTypeColors: Record<
  TaskType,
  { bg: string; text: string; label: string }
> = {
  plan: { bg: "bg-blue-100", text: "text-blue-700", label: "Plan" },
  learn: { bg: "bg-purple-100", text: "text-purple-700", label: "Learn" },
  practice: { bg: "bg-green-100", text: "text-green-700", label: "Practice" },
  review: { bg: "bg-amber-100", text: "text-amber-700", label: "Review" },
};

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [notes, setNotes] = useState("");

  const taskId = params.taskId as string;
  const goalId = params.goalId as string;

  const task = mockTasks.find((t) => t.id === taskId);
  const progress = task ? getTaskProgress(task.id) : null;
  const isCompleted = progress?.completed ?? false;

  if (!task) {
    return (
      <div className="text-center">
        <p className="text-neutral-600">Task not found</p>
      </div>
    );
  }

  const typeStyle = taskTypeColors[task.type];

  const handleComplete = () => {
    toast.success("Task completed! Great work! 🎉");
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push(`/goals/${goalId}`)}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Roadmap
      </Button>

      {/* Header */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Badge className={`${typeStyle.bg} ${typeStyle.text} border-0`}>
            {typeStyle.label}
          </Badge>
          <span className="text-sm text-neutral-500">Day {task.dayNumber}</span>
          {isCompleted && (
            <Badge className="bg-green-100 text-green-700">Completed</Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold text-neutral-900">{task.title}</h1>
      </div>

      {/* Learning Guide */}
      <Card className="rounded-2xl border-2">
        <CardContent className="p-6">
          <h2 className="mb-3 text-lg font-semibold text-neutral-900">
            Learning Guide
          </h2>
          <p className="leading-relaxed text-neutral-700">{task.shortGuide}</p>
        </CardContent>
      </Card>

      {/* Resources */}
      {task.resources.length > 0 && (
        <Card className="rounded-2xl border-2">
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-neutral-900">
              Curated Resources
            </h2>
            <div className="space-y-3">
              {task.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border-2 border-neutral-200 p-4 transition-all hover:border-primary hover:bg-primary/5"
                >
                  <span className="font-medium text-neutral-900">
                    {resource.label}
                  </span>
                  <ExternalLink className="h-4 w-4 text-neutral-400" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      <Card className="rounded-2xl border-2">
        <CardContent className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Your Notes
          </h2>
          <Textarea
            placeholder="Add notes about what you learned, questions you have, or key takeaways..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[150px] resize-none rounded-xl"
          />
        </CardContent>
      </Card>

      {/* Complete Button */}
      <Card className="rounded-2xl border-2 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-1 font-semibold text-neutral-900">
                Ready to move forward?
              </h3>
              <p className="text-sm text-neutral-600">
                Mark this task as complete when you&apos;re done
              </p>
            </div>
            <Button
              onClick={handleComplete}
              disabled={isCompleted}
              className="h-11 gap-2 rounded-xl px-6 font-semibold"
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Completed
                </>
              ) : (
                "Mark as Done"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
