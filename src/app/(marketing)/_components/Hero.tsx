"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 py-20 md:py-32">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-primary shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            AI-Powered Learning Paths
          </motion.div>

          {/* Headline */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-neutral-900 md:text-6xl lg:text-7xl">
            Turning Ambition
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Into Action
            </span>
          </h1>

          {/* Subtext */}
          <p className="mb-10 text-lg text-neutral-600 md:text-xl">
            Transform any goal into a personalized, day-by-day roadmap.
            <br className="hidden md:block" />
            Learn smarter with AI-curated resources and adaptive tracking.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="group h-12 gap-2 rounded-xl bg-primary px-8 text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 gap-2 rounded-xl border-2 px-8 text-base font-semibold"
            >
              <Play className="h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 grid grid-cols-3 gap-8 border-t border-neutral-200 pt-8"
          >
            <div>
              <div className="text-3xl font-bold text-neutral-900">10K+</div>
              <div className="text-sm text-neutral-600">Active Learners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-neutral-900">50K+</div>
              <div className="text-sm text-neutral-600">Goals Achieved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-neutral-900">95%</div>
              <div className="text-sm text-neutral-600">Success Rate</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
