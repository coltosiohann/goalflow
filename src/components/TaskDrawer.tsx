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
import { ExternalLink, X, CheckCircle2, Play, BookOpen, Brain } from "lucide-react";
import { type Task, type TaskType } from "@/lib/mock";
import { QuizWidget } from "@/components/QuizWidget";
import confetti from "canvas-confetti";

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
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [videoWatched, setVideoWatched] = useState(false);

  if (!task) return null;

  const typeStyle = taskTypeColors[task.type];
  const hasQuiz = task.quiz && task.quiz.length > 0;
  const hasVideo = !!task.videoUrl;
  const quizPassed = quizScore !== null && quizScore >= 80;
  const canComplete = completed || !hasQuiz || quizPassed;

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const handleQuizComplete = (score: number, answers: number[]) => {
    setQuizScore(score);
    setQuizAnswers(answers);

    if (score >= 80) {
      // Trigger confetti celebration!
      triggerConfetti();
    }
  };

  const handleMarkComplete = () => {
    if (!canComplete) return;
    onComplete?.();
    triggerConfetti();
    setTimeout(() => {
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-3xl overflow-y-auto">
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
                  {completed && (
                    <Badge className="bg-green-100 text-green-700">
                      Completed
                    </Badge>
                  )}
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
            {/* Learning Guide */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-neutral-900">
                  Learning Guide
                </h3>
              </div>
              <p className="leading-relaxed text-neutral-700">
                {task.shortGuide}
              </p>
            </div>

            {/* Video Section */}
            {hasVideo && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Play className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-neutral-900">Watch Video</h3>
                  {videoWatched && (
                    <Badge className="bg-green-100 text-green-700">
                      Watched
                    </Badge>
                  )}
                </div>
                <div className="overflow-hidden rounded-2xl border-2 border-neutral-200">
                  <div className="relative" style={{ paddingBottom: "56.25%" }}>
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={task.videoUrl}
                      title={task.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={() => setVideoWatched(true)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Resources */}
            {task.resources.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-neutral-900">
                    Resources
                  </h3>
                </div>
                <div className="space-y-2">
                  {task.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border-2 border-neutral-200 p-3 transition-all hover:border-primary hover:bg-primary/5"
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

            {/* Quiz Section */}
            {hasQuiz && !completed && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-neutral-900">
                    Knowledge Check
                  </h3>
                  {quizPassed && (
                    <Badge className="bg-green-100 text-green-700">
                      Passed ({quizScore}%)
                    </Badge>
                  )}
                </div>
                <QuizWidget
                  questions={task.quiz}
                  onComplete={handleQuizComplete}
                />
              </div>
            )}

            {/* Quiz requirement message */}
            {hasQuiz && !completed && !quizPassed && quizScore !== null && (
              <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                You need to score 80% or higher on the quiz to complete this task.
                Keep trying - you've got this!
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
              onClick={handleMarkComplete}
              disabled={!canComplete}
              className="h-12 w-full gap-2 rounded-xl text-base font-semibold"
            >
              {completed ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Completed
                </>
              ) : !canComplete ? (
                "Complete Quiz to Continue"
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
