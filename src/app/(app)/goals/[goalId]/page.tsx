"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";
import {
  mockGoals,
  mockMilestones,
  mockTasks,
  getMilestoneProgress,
  getGoalProgress,
} from "@/lib/mock";
import { ArrowLeft, Calendar } from "lucide-react";

export default function GoalOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const goalId = params.goalId as string;

  const goal = mockGoals.find((g) => g.id === goalId);
  const milestones = mockMilestones.filter((m) => m.goalId === goalId);
  const goalProgress = getGoalProgress(goalId);

  if (!goal) {
    return (
      <div className="text-center">
        <p className="text-neutral-600">Goal not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-neutral-900">
              {goal.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-neutral-600">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {goal.timeframeDays} days
              </span>
              <Badge
                variant="secondary"
                className="capitalize"
              >
                {goal.status}
              </Badge>
            </div>
          </div>
          <Button onClick={() => router.push("/dashboard")}>
            View Today
          </Button>
        </div>

        {/* Overall Progress */}
        <Card className="rounded-2xl border-2">
          <CardContent className="p-6">
            <ProgressBar
              label="Overall Progress"
              value={goalProgress}
              showPercentage
            />
          </CardContent>
        </Card>
      </div>

      {/* Milestones */}
      <div>
        <h2 className="mb-4 text-2xl font-bold text-neutral-900">
          Learning Roadmap
        </h2>

        <div className="space-y-4">
          {milestones.map((milestone, index) => {
            const progress = getMilestoneProgress(milestone.id);
            const milestoneTasks = mockTasks.filter(
              (t) => t.milestoneId === milestone.id
            );
            const isCompleted = progress === 100;

            return (
              <Card
                key={milestone.id}
                className="rounded-2xl border-2 transition-all hover:border-primary/50"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          Days {milestone.dayStart}-{milestone.dayEnd}
                        </Badge>
                        {isCompleted && (
                          <Badge className="bg-green-100 text-green-700">
                            Completed
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">
                        {index + 1}. {milestone.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ProgressBar
                    label={`${milestoneTasks.length} tasks`}
                    value={progress}
                    showPercentage
                  />

                  {/* Task list preview */}
                  <div className="space-y-2">
                    {milestoneTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-2 text-sm text-neutral-600"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span>Day {task.dayNumber}: {task.title}</span>
                      </div>
                    ))}
                    {milestoneTasks.length > 3 && (
                      <div className="text-xs text-neutral-500">
                        +{milestoneTasks.length - 3} more tasks
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
