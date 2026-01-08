"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Map,
  Brain,
  Bookmark,
  GraduationCap,
  BarChart3,
  Network,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Map,
    title: "Smart Roadmap Generator",
    description:
      "Our AI analyzes your goal and creates a precise, day-by-day execution plan tailored to your timeline.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Brain,
    title: "Adaptive Learning Engine",
    description:
      "The system learns from your progress, adjusting difficulty and pacing to keep you in the flow state.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Bookmark,
    title: "Curated Knowledge Base",
    description:
      "Stop searching. We provide handpicked, high-quality resources (videos, articles) for every single task.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: GraduationCap,
    title: "Interactive Quizzes",
    description:
      "Test your understanding with AI-generated quizzes that reinforce key concepts and ensure mastery.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description:
      "Visualize your journey with detailed charts, streak tracking, and completion forecasts.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: Network,
    title: "Skill Graph",
    description:
      "See how your goals connect. Leverage existing skills to accelerate learning in new areas.",
    color: "bg-indigo-50 text-indigo-600",
  },
];

export function Features() {
  return (
    <section className="bg-neutral-50/50 py-12 md:py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
            <Zap className="h-3 w-3" />
            <span>Power Features</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl lg:text-5xl">
            Everything You Need to <span className="text-primary">Succeed</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-neutral-600">
            Don&apos;t just set goals; crush them with a suite of powerful tools designed for high achievers.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="group relative h-full overflow-hidden border-0 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                <CardContent className="p-8">
                  {/* Decorative Background Blob */}
                  <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 transition-opacity group-hover:opacity-20 ${feature.color.split(' ')[0]}`} />
                  
                  {/* Icon */}
                  <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color} transition-transform duration-300 group-hover:scale-110`}>
                    <feature.icon className="h-7 w-7" />
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 text-xl font-bold text-neutral-900">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-neutral-600">
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

