"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Map,
  Brain,
  Bookmark,
  GraduationCap,
  BarChart3,
  Network,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Map,
    title: "Roadmap Generator",
    description:
      "AI creates detailed, day-by-day learning paths customized to your goal and timeline.",
  },
  {
    icon: Brain,
    title: "Adaptive Learning",
    description:
      "Dynamic difficulty adjustment based on your progress and comprehension levels.",
  },
  {
    icon: Bookmark,
    title: "Curated Resources",
    description:
      "Handpicked tutorials, articles, and videos from trusted sources for each task.",
  },
  {
    icon: GraduationCap,
    title: "Flashcards & Quizzes",
    description:
      "Reinforce learning with interactive flashcards and knowledge checks.",
  },
  {
    icon: BarChart3,
    title: "Progress & Streaks",
    description:
      "Track your journey with detailed analytics, streaks, and milestone celebrations.",
  },
  {
    icon: Network,
    title: "Cross-Goal Intelligence",
    description:
      "Leverage insights from one goal to accelerate learning in related areas.",
  },
];

export function Features() {
  return (
    <section className="bg-gradient-to-b from-neutral-50 to-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-neutral-900 md:text-4xl">
            Everything You Need to Succeed
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-neutral-600">
            Powerful features designed to keep you motivated and on track
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
            >
              <Card className="group h-full rounded-2xl border-2 transition-all hover:border-primary/50 hover:shadow-lg">
                <CardContent className="p-6">
                  {/* Icon */}
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 transition-all group-hover:scale-110">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="mb-2 text-lg font-bold text-neutral-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
