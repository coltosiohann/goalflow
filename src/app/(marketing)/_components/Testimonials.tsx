"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Developer",
    content:
      "GoalFlow helped me transition into data science in just 90 days. The AI-generated roadmap was perfectly paced and the resources were top-notch!",
    avatar: "SC",
  },
  {
    name: "Marcus Johnson",
    role: "Marketing Manager",
    content:
      "I finally learned to code thanks to GoalFlow. The daily tasks kept me accountable and the progress tracking was incredibly motivating.",
    avatar: "MJ",
  },
  {
    name: "Emily Rodriguez",
    role: "Freelance Designer",
    content:
      "The structured approach made all the difference. I went from zero to fluent in Spanish in 6 months. Highly recommend!",
    avatar: "ER",
  },
];

export function Testimonials() {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-neutral-900 md:text-4xl">
            Loved by Learners Worldwide
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-neutral-600">
            Join thousands who have achieved their goals with GoalFlow
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="h-full rounded-2xl border-2">
                <CardContent className="p-6">
                  {/* Stars */}
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="mb-6 text-neutral-700">
                    &quot;{testimonial.content}&quot;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-neutral-600">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
