"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";

export function CtaBand() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-neutral-900 px-6 py-20 text-center shadow-2xl md:px-20 md:py-24"
        >
          {/* Background Gradient & Effects */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/20 blur-[100px]" />

          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              Start Your Journey Today
            </h2>
            <p className="mb-10 text-lg text-neutral-400 md:text-xl">
              Stop waiting for the perfect moment. Create your personalized roadmap in seconds and start making progress.
            </p>

            <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="h-14 rounded-2xl border-white/10 bg-white/5 px-6 text-white placeholder:text-neutral-500 focus:border-primary focus:bg-white/10 focus:ring-0"
              />
              <Button
                size="lg"
                className="h-14 shrink-0 rounded-2xl bg-white px-8 text-base font-bold text-neutral-900 hover:bg-neutral-100 sm:w-auto"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-neutral-400">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
