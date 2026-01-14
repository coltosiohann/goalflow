"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    content:
      "I used GoalFlow to transition into React development. The daily roadmap kept me accountable when tutorials alone couldn't. I landed my first job in 3 months!",
    avatar: "SC",
    image: "/avatars/avatar-1.png",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Marcus Johnson",
    role: "Product Manager",
    content:
      "Finally, a tool that doesn't just list tasks but actually teaches you. The curated resources for each step saved me hours of searching.",
    avatar: "MJ",
    image: "/avatars/avatar-2.png",
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Emily Rodriguez",
    role: "Digital Artist",
    content:
      "I wanted to learn 3D modeling but was overwhelmed. GoalFlow broke it down into 45-minute daily chunks. It made the impossible feel manageable.",
    avatar: "ER",
    image: "/avatars/avatar-3.png",
    color: "bg-purple-100 text-purple-700",
  },
];

export function Testimonials() {
  return (
    <section className="bg-neutral-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl lg:text-5xl">
            Loved by <span className="text-primary">Achievers</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-neutral-600">
            Join thousands of others who are turning their &quot;one day&quot; into &quot;day one&quot;.
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
              <Card className="h-full border-0 bg-white shadow-md transition-shadow hover:shadow-xl">
                <CardContent className="p-8">
                  {/* Quote Icon */}
                  <Quote className="mb-6 h-8 w-8 text-primary/20" />

                  {/* Stars */}
                  <div className="mb-4 flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="mb-8 text-lg leading-relaxed text-neutral-700">
                    &quot;{testimonial.content}&quot;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 border-t border-neutral-100">
                    <div className={`relative flex h-12 w-12 items-center justify-center rounded-full ${testimonial.color} text-sm font-bold overflow-hidden`}>
                      <div className="absolute inset-0">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-neutral-900">
                          {testimonial.name}
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="text-sm text-neutral-500">
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
