"use client";

import { Target, Sparkles, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Target,
    title: "1. Set Your Goal",
    description:
      "Define your ambition and available timeframe. Whether it's learning Spanish in 30 days or mastering Python in 90.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: Sparkles,
    title: "2. AI Generates Plan",
    description:
      "Our engine breaks your goal down into milestones and daily tasks, curating the best resources for each specific step.",
    color: "from-purple-500 to-pink-400",
  },
  {
    icon: TrendingUp,
    title: "3. Execute & Track",
    description:
      "Follow the roadmap day by day. Complete tasks, take quizzes, and watch your progress streak grow.",
    color: "from-amber-500 to-orange-400",
  },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl lg:text-5xl">
            From Idea to <span className="text-primary">Done</span> in 3 Steps
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-neutral-600">
            Complex goals made simple. We handle the planning so you can focus on the doing.
          </p>
        </motion.div>

        <div className="relative grid gap-8 lg:grid-cols-3">
          {/* Connector Line (Desktop) */}
          <div className="absolute top-24 left-0 hidden w-full -translate-y-1/2 lg:block">
            <div className="h-0.5 w-full border-t-2 border-dashed border-neutral-200" />
            <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-200" />
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="relative"
            >
              <div className="group relative z-10 h-full rounded-3xl bg-white p-2 transition-all hover:-translate-y-2">
                <div className="h-full rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:shadow-primary/5">
                  {/* Icon Bubble */}
                  <div className={`mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg shadow-neutral-200 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                    <step.icon className="h-10 w-10 text-white" />
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="mb-4 text-xl font-bold text-neutral-900">
                      {step.title}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
