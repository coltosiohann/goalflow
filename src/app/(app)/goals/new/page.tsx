"use client";

import { Sparkles } from "lucide-react";
import { GoalWizardContainer } from "@/components/GoalWizard/WizardContainer";

export default function NewGoalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-background dark:to-background pointer-events-none" />

      <div className="w-full max-w-xl space-y-8 animate-in fade-in zoom-in-95 duration-500">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-xl shadow-indigo-500/30 ring-4 ring-white dark:ring-slate-900">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            What&apos;s your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">triumph?</span>
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
            Describe your ambition, and our AI will architect the perfect path to achieve it.
          </p>
        </div>

        {/* The New Wizard */}
        <GoalWizardContainer />

        {/* Footer Info */}
        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
          Powered by advanced AI to create personalized, day-by-day learning schedules.
        </p>
      </div>
    </div>
  );
}
