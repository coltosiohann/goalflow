"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function NewGoalPage() {
  const router = useRouter();
  const [goalTitle, setGoalTitle] = useState("");
  const [timeframe, setTimeframe] = useState([30]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!goalTitle.trim()) {
      toast.error("Please enter a goal title");
      return;
    }

    // Mock: In real app, this would create a goal via API
    toast.success("Goal created! Generating your roadmap...", {
      duration: 2000,
    });

    // Redirect to dashboard after a brief delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-neutral-900">
          Create Your Goal
        </h1>
        <p className="text-neutral-600">
          Tell us what you want to achieve and we&apos;ll build your
          personalized roadmap
        </p>
      </div>

      {/* Form */}
      <Card className="rounded-2xl border-2">
        <CardHeader>
          <CardTitle>Goal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Goal Title */}
            <div className="space-y-2">
              <label
                htmlFor="goal-title"
                className="text-sm font-medium text-neutral-700"
              >
                What do you want to learn or achieve?
              </label>
              <Input
                id="goal-title"
                type="text"
                placeholder="e.g., Learn Python, Master Photography, Build a Mobile App"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="h-12 rounded-xl"
              />
              <p className="text-xs text-neutral-500">
                Be specific about what you want to accomplish
              </p>
            </div>

            {/* Timeframe Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-neutral-700">
                  Timeframe
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">
                    {timeframe[0]}
                  </span>
                  <span className="text-sm text-neutral-600">days</span>
                </div>
              </div>

              <Slider
                value={timeframe}
                onValueChange={setTimeframe}
                min={7}
                max={180}
                step={1}
                className="py-4"
              />

              <div className="flex justify-between text-xs text-neutral-500">
                <span>1 week</span>
                <span>6 months</span>
              </div>

              <p className="text-xs text-neutral-500">
                Choose a timeframe that&apos;s challenging but realistic for
                your schedule
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="group h-12 w-full gap-2 rounded-xl text-base font-semibold"
            >
              <Sparkles className="h-5 w-5" />
              Generate Roadmap
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="rounded-2xl border-2 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <h3 className="mb-2 font-semibold text-neutral-900">
            What happens next?
          </h3>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">•</span>
              <span>
                Our AI will analyze your goal and create a day-by-day learning
                path
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">•</span>
              <span>
                You&apos;ll get curated resources, tasks, and milestones
                tailored to your timeframe
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">•</span>
              <span>
                Track your progress and adjust your pace as you learn
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
