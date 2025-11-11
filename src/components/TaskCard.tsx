"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";
import { type Task, type TaskType } from "@/lib/mock";

interface TaskCardProps {
  task: Task;
  completed?: boolean;
  onOpen: () => void;
}

const taskTypeColors: Record<
  TaskType,
  { bg: string; text: string; label: string }
> = {
  plan: { bg: "bg-blue-100", text: "text-blue-700", label: "Plan" },
  learn: { bg: "bg-purple-100", text: "text-purple-700", label: "Learn" },
  practice: { bg: "bg-green-100", text: "text-green-700", label: "Practice" },
  review: { bg: "bg-amber-100", text: "text-amber-700", label: "Review" },
};

export function TaskCard({ task, completed = false, onOpen }: TaskCardProps) {
  const typeStyle = taskTypeColors[task.type];

  return (
    <Card className="group rounded-2xl border-2 transition-all hover:border-primary/50 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Completion status */}
          <button
            className="mt-1 flex-shrink-0 transition-transform hover:scale-110"
            aria-label={completed ? "Completed" : "Mark as complete"}
          >
            {completed ? (
              <CheckCircle2 className="h-6 w-6 text-primary" />
            ) : (
              <Circle className="h-6 w-6 text-neutral-300" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1">
            <div className="mb-2 flex items-start justify-between gap-4">
              <h3 className="font-semibold text-neutral-900">{task.title}</h3>
              <Badge
                className={`${typeStyle.bg} ${typeStyle.text} flex-shrink-0 border-0`}
              >
                {typeStyle.label}
              </Badge>
            </div>

            <p className="mb-4 line-clamp-2 text-sm text-neutral-600">
              {task.shortGuide}
            </p>

            <Button
              onClick={onOpen}
              variant="ghost"
              size="sm"
              className="h-9 rounded-lg text-primary hover:bg-primary/10 hover:text-primary"
            >
              Open Task
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
