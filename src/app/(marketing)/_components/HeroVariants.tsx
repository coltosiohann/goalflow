"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

// Shared content component
function HeroContent() {
  return (
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
  );
}

// Option 1: Animated Gradient Blobs (Modern SaaS)
export function HeroBlobs() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 py-20 md:py-32">
      {/* Animated blob backgrounds */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 75, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-300/20 blur-3xl"
      />

      <HeroContent />
    </section>
  );
}

// Option 2: Radial Glow Effects (Dreamy, Premium)
export function HeroGlow() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20 md:py-32">
      {/* Radial glows */}
      <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-radial from-primary/30 via-primary/10 to-transparent blur-2xl" />
      <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-gradient-radial from-accent/30 via-accent/10 to-transparent blur-2xl" />
      <div className="absolute bottom-1/4 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-gradient-radial from-indigo-400/20 via-indigo-400/5 to-transparent blur-2xl" />

      <HeroContent />
    </section>
  );
}

// Option 3: Clean Gradient Only (Minimal, Apple-style)
export function HeroClean() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 py-20 md:py-32">
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/40" />

      <HeroContent />
    </section>
  );
}

// Option 4: Mesh Gradient (Super Trendy)
export function HeroMesh() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 md:py-32">
      {/* Mesh gradient effect */}
      <div className="absolute inset-0 opacity-60">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(at 0% 0%, rgba(49, 107, 255, 0.3) 0px, transparent 50%),
              radial-gradient(at 100% 0%, rgba(123, 97, 255, 0.3) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.3) 0px, transparent 50%),
              radial-gradient(at 0% 100%, rgba(139, 92, 246, 0.3) 0px, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Animated overlay */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
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

      <HeroContent />
    </section>
  );
}

// Option 5: Floating Particles (Subtle Animation)
export function HeroParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 py-20 md:py-32">
      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <HeroContent />
    </section>
  );
}
