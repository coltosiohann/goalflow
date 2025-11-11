"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Target, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Target,
    title: "Set Your Goal",
    description:
      "Tell us what you want to achieve and your timeframe. From learning a new language to mastering a skill.",
  },
  {
    icon: Sparkles,
    title: "AI Builds Your Plan",
    description:
      "Our AI generates a personalized roadmap with daily tasks, resources, and milestones tailored to your pace.",
  },
  {
    icon: TrendingUp,
    title: "Learn & Track Progress",
    description:
      "Follow your daily tasks, track your progress, and watch your skills grow with adaptive learning paths.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-neutral-900 md:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-neutral-600">
            Three simple steps to transform your ambitions into achievements
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="group relative h-full overflow-hidden rounded-2xl border-2 transition-all hover:border-primary hover:shadow-lg">
                <CardContent className="p-8">
                  {/* Step number */}
                  <div className="mb-4 text-6xl font-bold text-neutral-100">
                    {(index + 1).toString().padStart(2, "0")}
                  </div>

                  {/* Icon */}
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent p-3 shadow-lg shadow-primary/25">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 text-xl font-bold text-neutral-900">
                    {step.title}
                  </h3>
                  <p className="text-neutral-600">{step.description}</p>

                  {/* Decorative gradient */}
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-primary/5 to-accent/5 blur-2xl transition-all group-hover:scale-150" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
