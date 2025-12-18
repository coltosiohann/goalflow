"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play, Apple } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white py-6 sm:py-8 md:py-12 lg:py-14">
      <div className="container mx-auto px-4">
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left"
          >
          <div className="mb-4" />

          {/* Headline - Responsive sizing */}
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-neutral-900 sm:mb-5 sm:text-5xl md:mb-6 md:text-6xl lg:text-[68px] lg:leading-[1.03]">
            Meet GoalFlow
            <br />
            Transform Goals With AI
          </h1>

          {/* Subtext - Better mobile spacing */}
          <p className="mb-8 px-4 text-base leading-relaxed text-neutral-600 sm:px-0 sm:text-lg md:mb-10 md:text-xl">
            Transform any goal into a personalized, day-by-day roadmap.
            <br className="hidden sm:block" />
            Learn smarter with AI-curated resources and adaptive tracking.
          </p>

          {/* CTAs - Mobile optimized */}
          <div className="flex w-full flex-col items-center justify-center gap-3 px-4 sm:w-auto sm:flex-row sm:gap-4 sm:px-0">
            <StoreButton
              icon={<Apple className="h-6 w-6" />}
              label="Download on the"
              brand="App Store"
            />
            <StoreButton
              icon={<Play className="h-5 w-5" />}
              label="Get it on"
              brand="Google Play"
            />
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

          <HeroPhones />
        </div>
      </div>
    </section>
  );
}

function StoreButton({
  icon,
  label,
  brand,
}: {
  icon: React.ReactNode;
  label: string;
  brand: string;
}) {
  return (
    <Button
      variant="outline"
      className="flex h-12 w-full items-center gap-3 rounded-2xl border-neutral-200 px-5 text-left text-sm font-medium text-neutral-800 sm:w-auto sm:text-base"
    >
      {icon}
      <span>
        <span className="block text-xs text-neutral-500">{label}</span>
        <span className="text-sm font-semibold text-neutral-900">{brand}</span>
      </span>
    </Button>
  );
}

function HeroPhones() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="relative mx-auto flex max-w-md items-center justify-center lg:max-w-none"
    >
      <div className="pointer-events-none absolute -left-10 top-12 hidden h-60 w-60 rounded-full bg-primary/25 blur-3xl sm:block" />
      <div className="pointer-events-none absolute -bottom-12 right-0 hidden h-52 w-52 rounded-full bg-accent/25 blur-3xl sm:block" />

      <div className="relative w-full max-w-xl sm:max-w-2xl lg:max-w-[760px]">
        <Image
          src="/hero-phones.png"
          alt="GoalFlow mobile experience"
          width={1400}
          height={900}
          priority
          className="w-full object-contain drop-shadow-[0_50px_90px_rgba(15,23,42,0.35)]"
        />
      </div>
    </motion.div>
  );
}
