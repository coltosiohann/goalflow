"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function CtaBand() {
  return (
    <section className="bg-gradient-to-br from-primary via-accent to-primary py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Ready to Achieve Your Goals?
          </h2>
          <p className="mb-8 text-lg text-white/90 md:text-xl">
            Join thousands of learners who are turning their ambitions into
            reality.
            <br />
            Start your journey today, completely free.
          </p>

          {/* Email input */}
          <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-12 rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:border-white focus:bg-white/20"
            />
            <Button
              size="lg"
              className="group h-12 gap-2 rounded-xl bg-white px-8 text-base font-semibold text-primary shadow-lg hover:bg-white/90"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <p className="mt-4 text-sm text-white/75">
            No credit card required. Free forever.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
