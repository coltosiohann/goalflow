"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, X, CheckCircle2 } from "lucide-react";
import { type Task, type TaskType } from "@/lib/mock";

interface TaskDrawerProps {
  task: Task | null;
  completed?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
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

export function TaskDrawer({
  task,
  completed = false,
  open,
  onOpenChange,
  onComplete,
}: TaskDrawerProps) {
  const [notes, setNotes] = useState("");

  if (!task) return null;

  const typeStyle = taskTypeColors[task.type];

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-2xl overflow-y-auto">
          <DrawerHeader className="text-left">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-2">
                  <Badge
                    className={`${typeStyle.bg} ${typeStyle.text} border-0`}
                  >
                    {typeStyle.label}
                  </Badge>
                  <span className="text-sm text-neutral-500">
                    Day {task.dayNumber}
                  </span>
                </div>
                <DrawerTitle className="text-2xl">{task.title}</DrawerTitle>
                <DrawerDescription className="sr-only">
                  Task details and resources
                </DrawerDescription>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="space-y-6 p-6 pt-0">
            {/* Guide */}
            <div>
              <h3 className="mb-2 font-semibold text-neutral-900">
                Learning Guide
              </h3>
              <p className="text-neutral-700">{task.shortGuide}</p>
            </div>

            {/* Resources */}
            {task.resources.length > 0 && (
              <div>
                <h3 className="mb-3 font-semibold text-neutral-900">
                  Resources
                </h3>
                <div className="space-y-2">
                  {task.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-neutral-200 p-3 transition-colors hover:border-primary hover:bg-primary/5"
                    >
                      <span className="text-sm font-medium text-neutral-900">
                        {resource.label}
                      </span>
                      <ExternalLink className="h-4 w-4 text-neutral-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <h3 className="mb-2 font-semibold text-neutral-900">
                Your Notes
              </h3>
              <Textarea
                placeholder="Add notes about what you learned or questions you have..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px] resize-none rounded-xl"
              />
            </div>
          </div>

          <DrawerFooter>
            <Button
              onClick={() => {
                onComplete?.();
                onOpenChange(false);
              }}
              disabled={completed}
              className="h-12 w-full gap-2 rounded-xl text-base font-semibold"
            >
              {completed ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Completed
                </>
              ) : (
                "Mark as Done"
              )}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
