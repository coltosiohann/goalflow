"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Brain, Route, CheckCircle2 } from "lucide-react";

interface GeneratingRoadmapModalProps {
  isOpen: boolean;
  goalTitle: string;
}

const steps = [
  { icon: Brain, label: "Analyzing your goal...", duration: 2000 },
  { icon: Route, label: "Creating learning path...", duration: 3000 },
  { icon: Sparkles, label: "Generating tasks & resources...", duration: 4000 },
  { icon: CheckCircle2, label: "Finalizing roadmap...", duration: 2000 },
];

export function GeneratingRoadmapModal({ isOpen, goalTitle }: GeneratingRoadmapModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    // Progress through steps while modal stays open
    const timers: Array<ReturnType<typeof setTimeout>> = [];
    let totalTime = 0;

    steps.forEach((step, index) => {
      totalTime += step.duration;
      const timer = setTimeout(() => {
        setCurrentStep(index + 1);
      }, totalTime);
      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
      setCurrentStep(0);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md rounded-2xl border-2">
        <CardContent className="p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25 animate-pulse">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-neutral-900">
              Creating Your Roadmap
            </h2>
            <p className="text-sm text-neutral-600">
              Our AI is designing a personalized learning path for:
            </p>
            <p className="mt-2 font-semibold text-primary">
              &quot;{goalTitle}&quot;
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isComplete = currentStep > index;
              const isCurrent = currentStep === index;

              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 rounded-xl p-4 transition-all ${
                    isCurrent
                      ? "bg-primary/10 border-2 border-primary/20"
                      : isComplete
                      ? "bg-green-50 border-2 border-green-200"
                      : "bg-neutral-50 border-2 border-neutral-200"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all ${
                      isCurrent
                        ? "bg-primary text-white animate-pulse"
                        : isComplete
                        ? "bg-green-500 text-white"
                        : "bg-neutral-300 text-neutral-500"
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isCurrent
                        ? "text-primary"
                        : isComplete
                        ? "text-green-700"
                        : "text-neutral-500"
                    }`}
                  >
                    {step.label}
                  </span>
                  {isCurrent && (
                    <div className="ml-auto">
                      <div className="h-2 w-2 animate-ping rounded-full bg-primary"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Fun fact */}
          <div className="mt-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 p-4 text-center">
            <p className="text-xs text-neutral-600">
              💡 This usually takes 10-20 seconds
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
