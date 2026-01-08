"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Play, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-6 sm:pt-8 lg:pt-12">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-[10%] top-[20%] h-[600px] w-[600px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-8">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left z-10"
          >
            {/* Pill Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm font-medium text-neutral-600 transition-colors hover:border-primary/20 hover:bg-primary/5">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span>New: AI Roadmap Generation 2.0</span>
              <ArrowRight className="h-3 w-3 text-neutral-400" />
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[1.1]">
              Turn Your <span className="text-primary">Dreams</span>
              <br />
              Into <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Reality</span>
                <span className="absolute bottom-2 left-0 -z-10 h-3 w-full -rotate-1 bg-yellow-200/50" />
              </span>
            </h1>

            {/* Subtext */}
            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-neutral-600 sm:text-xl">
              Stop dreaming and start doing. GoalFlow uses advanced AI to break down your biggest ambitions into bite-sized, actionable daily tasks.
            </p>

            {/* CTAs */}
            <div className="flex flex-col w-full gap-4 sm:flex-row sm:w-auto lg:justify-start justify-center">
              <Button size="lg" className="h-14 gap-2 rounded-2xl px-8 text-lg font-semibold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                Start for Free
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 gap-2 rounded-2xl border-2 px-8 text-lg font-semibold hover:bg-neutral-50 transition-all hover:scale-105 active:scale-95">
                <Play className="h-5 w-5 fill-current" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof / Stats */}
            <div className="mt-12 flex flex-col items-center gap-6 border-t border-neutral-100 pt-8 sm:flex-row lg:items-start">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-neutral-100 ring-1 ring-black/5" />
                ))}
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center gap-1 sm:justify-start">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Sparkles key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mt-1 text-sm font-medium text-neutral-700">
                  Trusted by <span className="font-bold text-neutral-900">10,000+</span> achievers
                </p>
              </div>
            </div>
          </motion.div>

          {/* Visual Content */}
          <HeroPhones />
        </div>
      </div>
    </section>
  );
}

function HeroPhones() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-[600px] lg:max-w-none lg:scale-110 translate-y-4 lg:translate-y-8 -mb-12 lg:-mb-24"
    >
      <div className="relative z-10">
        <Image
          src="/hero-phones.png"
          alt="GoalFlow mobile experience"
          width={1400}
          height={900}
          priority
          className="w-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-transform duration-700 hover:scale-[1.02]"
        />
      </div>
      
      {/* Decorative Blobs */}
      <div className="absolute -right-20 -top-20 -z-10 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl" />
      <div className="absolute -bottom-20 -left-20 -z-10 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-accent/20 to-transparent blur-3xl" />
    </motion.div>
  );
}
