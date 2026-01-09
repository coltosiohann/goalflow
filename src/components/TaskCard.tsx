"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Trophy, Swords } from "lucide-react";
import { type Task } from "@/lib/supabase/queries";
import { cn } from "@/lib/utils";

type TaskType = 'plan' | 'learn' | 'practice' | 'review' | 'quiz' | 'boss_battle';

interface TaskCardProps {
  task: Task;
  completed?: boolean;
  onOpen: () => void;
}

const taskTypeColors: Record<
  TaskType,
  { bg: string; text: string; label: string; icon?: any }
> = {
  plan: { bg: "bg-blue-100", text: "text-blue-700", label: "Plan" },
  learn: { bg: "bg-purple-100", text: "text-purple-700", label: "Learn" },
  practice: { bg: "bg-green-100", text: "text-green-700", label: "Practice" },
  review: { bg: "bg-amber-100", text: "text-amber-700", label: "Review" },
  quiz: { bg: "bg-pink-100", text: "text-pink-700", label: "Quiz" },
  boss_battle: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Boss Battle", icon: Swords },
};

export function TaskCard({ task, completed = false, onOpen }: TaskCardProps) {
  const typeStyle = taskTypeColors[task.type] || taskTypeColors.learn;
  const isBoss = task.type === 'boss_battle';

  return (
    <Card
      className={cn(
        "group rounded-2xl border-2 transition-all hover:shadow-lg",
        isBoss ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-white" : "hover:border-primary/50",
        completed && "opacity-75"
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Completion status */}
          <button
            className="mt-1 flex-shrink-0 transition-transform hover:scale-110"
            aria-label={completed ? "Completed" : "Mark as complete"}
          >
            {completed ? (
              <CheckCircle2 className={cn("h-6 w-6", isBoss ? "text-yellow-600" : "text-primary")} />
            ) : (
              <Circle className="h-6 w-6 text-neutral-300" />
            )}
          </button>

          {/* Content */}
          <div className="flex-1">
            <div className="mb-2 flex items-start justify-between gap-4">
              <h3 className={cn("font-semibold", isBoss ? "text-lg text-yellow-900" : "text-neutral-900")}>
                {task.title}
              </h3>
              <div className="flex flex-col items-end gap-1">
                <Badge
                  className={`${typeStyle.bg} ${typeStyle.text} flex-shrink-0 border-0`}
                >
                  {typeStyle.icon && <typeStyle.icon className="mr-1 h-3 w-3" />}
                  {typeStyle.label}
                </Badge>
                {task.xp_reward && (
                  <span className="text-xs font-bold text-neutral-400 flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-yellow-500" />
                    {task.xp_reward} XP
                  </span>
                )}
              </div>
            </div>

            <p className="mb-4 line-clamp-2 text-sm text-neutral-600">
              {task.short_guide}
            </p>

            <Button
              onClick={onOpen}
              variant={isBoss ? "default" : "ghost"}
              size="sm"
              className={cn(
                "h-9 rounded-lg",
                isBoss
                  ? "bg-yellow-500 text-white hover:bg-yellow-600"
                  : "text-primary hover:bg-primary/10 hover:text-primary"
              )}
            >
              {isBoss ? "Enter Battle" : "Open Task"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
