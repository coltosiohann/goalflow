"use client";

import { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import {
  ExternalLink,
  X,
  CheckCircle2,
  Play,
  BookOpen,
  Brain,
  Target,
  Lightbulb,
  Code2,
  CheckSquare,
  Swords,
  Trophy
} from "lucide-react";
import { clientQueries, type Task } from "@/lib/supabase/queries";
import { QuizWidget } from "@/components/QuizWidget";
import confetti from "canvas-confetti";

type TaskType = 'plan' | 'learn' | 'practice' | 'review' | 'boss_battle' | 'quiz';

interface TaskDrawerProps {
  task: Task | null;
  completed?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

const taskTypeColors: Record<
  string,
  { bg: string; text: string; label: string; icon?: any }
> = {
  plan: { bg: "bg-blue-100", text: "text-blue-700", label: "Plan", icon: Target },
  learn: { bg: "bg-purple-100", text: "text-purple-700", label: "Learn", icon: BookOpen },
  practice: { bg: "bg-green-100", text: "text-green-700", label: "Practice", icon: Code2 },
  review: { bg: "bg-amber-100", text: "text-amber-700", label: "Review", icon: Brain },
  boss_battle: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Boss Battle", icon: Swords },
  quiz: { bg: "bg-pink-100", text: "text-pink-700", label: "Quiz", icon: Brain },
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
  const [videoWatched, setVideoWatched] = useState(false);
  const [showingQuiz, setShowingQuiz] = useState(false);

  // Reset quiz state when drawer closes
  useEffect(() => {
    if (!open) return;

    return () => {
      setShowingQuiz(false);
      setQuizScore(null);
    };
  }, [open]);

  if (!task) return null;

  const typeStyle = taskTypeColors[task.type] || taskTypeColors.learn;
  const quizQuestions = Array.isArray(task.quiz) ? task.quiz : [];
  const hasQuiz = quizQuestions.length > 0;
  const hasVideo = !!task.video_url;
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

  const handleQuizComplete = async (score: number, answers: number[]) => {
    setQuizScore(score);

    if (score >= 80) {
      try {
        // Quiz passed! Mark task as complete in database
        await clientQueries.completeTask(task.id, score, answers);
        onComplete?.();
        triggerConfetti();
        setTimeout(() => {
          onOpenChange(false);
        }, 1000);
      } catch (error) {
        console.error('Error completing task:', error);
      }
    }
  };

  const handleMarkComplete = async () => {
    // If task has a quiz and quiz hasn't been shown yet, show it
    if (hasQuiz && !showingQuiz && !completed) {
      setShowingQuiz(true);
      // Scroll to quiz section
      setTimeout(() => {
        const quizSection = document.getElementById('quiz-section');
        if (quizSection) {
          quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return;
    }

    // Otherwise complete the task normally (for tasks without quiz)
    if (!canComplete) return;

    try {
      await clientQueries.completeTask(task.id);
      onComplete?.();
      triggerConfetti();
      setTimeout(() => {
        onOpenChange(false);
      }, 1000);
    } catch (error) {
      console.error('Error completing task:', error);
    }
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
                    {typeStyle.icon && <typeStyle.icon className="mr-1 h-3 w-3" />}
                    {typeStyle.label}
                  </Badge>
                  <span className="text-sm text-neutral-500">
                    Day {task.day_number}
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
            {/* Learning Objectives */}
            {task.learning_objectives && task.learning_objectives.length > 0 && (
              <div className="rounded-2xl bg-blue-50 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-700" />
                  <h3 className="font-semibold text-blue-900">
                    What You&apos;ll Learn
                  </h3>
                </div>
                <ul className="space-y-2">
                  {task.learning_objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-blue-900">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Why This Matters */}
            {task.why_this_matters && (
              <div className="rounded-2xl bg-amber-50 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-700" />
                  <h3 className="font-semibold text-amber-900">
                    Why This Matters
                  </h3>
                </div>
                <p className="leading-relaxed text-amber-900">
                  {task.why_this_matters}
                </p>
              </div>
            )}

            {/* Detailed Learning Content */}
            {task.detailed_content && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Learn the Concepts
                  </h3>
                </div>
                <div className="prose prose-neutral max-w-none rounded-2xl border-2 border-neutral-200 bg-neutral-50 p-5">
                  <div className="whitespace-pre-wrap leading-relaxed text-neutral-800">
                    {task.detailed_content}
                  </div>
                </div>
              </div>
            )}

            {/* Fallback to short guide if no detailed content */}
            {!task.detailed_content && task.short_guide && (
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-neutral-900">
                    Learning Guide
                  </h3>
                </div>
                <p className="leading-relaxed text-neutral-700">
                  {task.short_guide}
                </p>
              </div>
            )}

            {/* Video Section */}
            {hasVideo && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Play className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-neutral-900">Watch & Learn</h3>
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
                      src={task.video_url || ''}
                      title={task.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={() => setVideoWatched(true)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Hands-On Exercise */}
            {task.hands_on_exercise && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Code2 className="h-5 w-5 text-green-700" />
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Practice Exercise
                  </h3>
                </div>
                <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-5">
                  <div className="mb-3 rounded-lg bg-green-100 px-3 py-2 text-sm font-medium text-green-800">
                    🎯 Put your knowledge into practice!
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed text-green-900">
                    {task.hands_on_exercise}
                  </div>
                </div>
              </div>
            )}

            {/* Resources with Descriptions */}
            {task.resources && task.resources.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-neutral-900">
                    Additional Resources
                  </h3>
                </div>
                <div className="space-y-3">
                  {task.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl border-2 border-neutral-200 p-4 transition-all hover:border-primary hover:bg-primary/5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="mb-1 font-medium text-neutral-900">
                            {resource.label}
                          </div>
                          {resource.description && (
                            <p className="text-sm text-neutral-600">
                              {resource.description}
                            </p>
                          )}
                        </div>
                        <ExternalLink className="mt-1 h-4 w-4 flex-shrink-0 text-neutral-400" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Success Criteria Checklist */}
            {task.success_criteria && task.success_criteria.length > 0 && (
              <div>
                <Separator className="my-6" />
                <div className="mb-3 flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-purple-700" />
                  <h3 className="font-semibold text-neutral-900">
                    Before You Continue
                  </h3>
                </div>
                <div className="rounded-2xl bg-purple-50 p-5">
                  <p className="mb-3 text-sm text-purple-800">
                    Make sure you can check off these items:
                  </p>
                  <ul className="space-y-2">
                    {task.success_criteria.map((criterion, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-purple-900">
                        <CheckSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                        <span>{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Quiz Section - Only shows after user clicks "Mark as Done" */}
            {hasQuiz && (showingQuiz || completed) && (
              <div id="quiz-section" className="scroll-mt-4">
                <div className="mb-3 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-neutral-900">
                    Knowledge Check
                  </h3>
                  {completed && (
                    <Badge className="bg-green-100 text-green-700">
                      Completed
                    </Badge>
                  )}
                  {quizPassed && !completed && (
                    <Badge className="bg-green-100 text-green-700">
                      Passed ({quizScore}%)
                    </Badge>
                  )}
                </div>
                {!completed && (
                  <div className="mb-4 rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
                    Complete the quiz with 80% or higher to finish this task. Good luck! 🎯
                  </div>
                )}
                <QuizWidget
                  questions={quizQuestions}
                  onComplete={handleQuizComplete}
                />
              </div>
            )}

            {/* Quiz requirement message */}
            {hasQuiz && !completed && !quizPassed && quizScore !== null && (
              <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                You need to score 80% or higher on the quiz to complete this task.
                Keep trying - you&apos;ve got this!
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
              disabled={completed || (hasQuiz && showingQuiz && !quizPassed)}
              className="h-12 w-full gap-2 rounded-xl text-base font-semibold"
            >
              {completed ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Completed
                </>
              ) : hasQuiz && !showingQuiz ? (
                <>
                  <Brain className="h-5 w-5" />
                  I&apos;m Ready for the Quiz!
                </>
              ) : hasQuiz && showingQuiz && !quizPassed ? (
                "Complete Quiz to Finish"
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
