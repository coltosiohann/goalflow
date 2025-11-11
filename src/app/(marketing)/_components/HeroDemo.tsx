"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  HeroBlobs,
  HeroGlow,
  HeroClean,
  HeroMesh,
  HeroParticles,
} from "./HeroVariants";

const variants = [
  { name: "Animated Blobs", component: HeroBlobs, description: "Modern SaaS style - Stripe, Linear" },
  { name: "Radial Glow", component: HeroGlow, description: "Dreamy, premium feel" },
  { name: "Clean Gradient", component: HeroClean, description: "Minimal, Apple-style" },
  { name: "Mesh Gradient", component: HeroMesh, description: "Super trendy, 2024 style" },
  { name: "Floating Particles", component: HeroParticles, description: "Subtle animation" },
];

export function HeroDemo() {
  const [activeVariant, setActiveVariant] = useState(0);

  const ActiveHero = variants[activeVariant].component;

  return (
    <div>
      {/* Variant Switcher */}
      <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
        <div className="rounded-2xl border-2 border-neutral-200 bg-white p-2 shadow-2xl">
          <div className="mb-3 px-3 pt-2">
            <p className="text-center text-sm font-semibold text-neutral-900">
              {variants[activeVariant].name}
            </p>
            <p className="text-center text-xs text-neutral-500">
              {variants[activeVariant].description}
            </p>
          </div>
          <div className="flex gap-2">
            {variants.map((variant, index) => (
              <Button
                key={variant.name}
                onClick={() => setActiveVariant(index)}
                variant={activeVariant === index ? "default" : "outline"}
                size="sm"
                className="min-w-[80px] text-xs"
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Hero Variant */}
      <ActiveHero />
    </div>
  );
}
