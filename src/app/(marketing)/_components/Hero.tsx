"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-16 sm:py-20 md:py-28 lg:py-32">
      {/* Mesh Gradient Background - Apple Style */}
      <div className="absolute inset-0 opacity-60">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(at 0% 0%, rgba(49, 107, 255, 0.33) 0px, transparent 50%),
              radial-gradient(at 100% 0%, rgba(123, 97, 255, 0.33) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.33) 0px, transparent 50%),
              radial-gradient(at 0% 100%, rgba(139, 92, 246, 0.33) 0px, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Subtle Animated Overlay - Creates the "breathing" effect */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(at 50% 50%, rgba(49, 107, 255, 0.2) 0px, transparent 50%)
          `,
        }}
      />

      {/* Subtle noise texture for depth - Apple aesthetic */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative z-10 mx-auto px-4">
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
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-primary shadow-sm backdrop-blur-sm sm:mb-6 sm:px-4 sm:text-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="hidden xs:inline">AI-Powered Learning Paths</span>
            <span className="xs:hidden">AI-Powered</span>
          </motion.div>

          {/* Headline - Responsive sizing */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900 sm:mb-5 sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl">
            Turning Ambition
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Into Action
            </span>
          </h1>

          {/* Subtext - Better mobile spacing */}
          <p className="mb-8 px-4 text-base leading-relaxed text-neutral-600 sm:px-0 sm:text-lg md:mb-10 md:text-xl">
            Transform any goal into a personalized, day-by-day roadmap.
            <br className="hidden sm:block" />
            Learn smarter with AI-curated resources and adaptive tracking.
          </p>

          {/* CTAs - Mobile optimized */}
          <div className="flex w-full flex-col items-center justify-center gap-3 px-4 sm:w-auto sm:flex-row sm:gap-4 sm:px-0">
            <Button
              size="lg"
              className="group h-11 w-full gap-2 rounded-xl bg-primary px-6 text-sm font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 sm:h-12 sm:w-auto sm:px-8 sm:text-base"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 w-full gap-2 rounded-xl border-2 px-6 text-sm font-semibold sm:h-12 sm:w-auto sm:px-8 sm:text-base"
            >
              <Play className="h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          {/* Stats - Mobile optimized grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid grid-cols-3 gap-4 border-t border-neutral-200 pt-6 sm:mt-14 sm:gap-8 sm:pt-8 md:mt-16"
          >
            <div>
              <div className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                10K+
              </div>
              <div className="text-xs text-neutral-600 sm:text-sm">
                Active Learners
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                50K+
              </div>
              <div className="text-xs text-neutral-600 sm:text-sm">
                Goals Achieved
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                95%
              </div>
              <div className="text-xs text-neutral-600 sm:text-sm">
                Success Rate
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
