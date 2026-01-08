import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hero } from "./_components/Hero";
import { HowItWorks } from "./_components/HowItWorks";
import { Features } from "./_components/Features";
import { Testimonials } from "./_components/Testimonials";
import { CtaBand } from "./_components/CtaBand";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-primary/10 selection:text-primary">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-neutral-200/50 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-sm">
              <span className="text-xl font-bold text-white">G</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-900">GoalFlow</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-primary"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-primary"
            >
              Testimonials
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/signin">
              <Button variant="ghost" size="sm" className="hidden text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 sm:flex">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="rounded-xl px-5 font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                Get Started
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-20">
        <Hero />
        <div id="features">
          <Features />
        </div>
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <div id="testimonials">
          <Testimonials />
        </div>
        <CtaBand />
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-100 bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="md:col-span-1">
              <Link href="/" className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900">
                  <span className="text-lg font-bold text-white">G</span>
                </div>
                <span className="text-xl font-bold text-neutral-900">
                  GoalFlow
                </span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-neutral-500">
                Empowering you to achieve more with AI-driven roadmaps and adaptive learning.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-neutral-900">
                Product
              </h3>
              <ul className="space-y-3 text-sm text-neutral-500">
                <li>
                  <Link href="#features" className="transition-colors hover:text-primary">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="transition-colors hover:text-primary">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-primary">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-neutral-900">
                Company
              </h3>
              <ul className="space-y-3 text-sm text-neutral-500">
                <li>
                  <Link href="#" className="transition-colors hover:text-primary">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-primary">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-neutral-900">
                Legal
              </h3>
              <ul className="space-y-3 text-sm text-neutral-500">
                <li>
                  <Link href="#" className="transition-colors hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-primary">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-primary">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center justify-between border-t border-neutral-100 pt-8 sm:flex-row">
            <div className="text-sm text-neutral-500">
              © {new Date().getFullYear()} GoalFlow. All rights reserved.
            </div>
            <div className="mt-4 flex gap-6 sm:mt-0">
              {/* Social placeholders */}
              <div className="h-5 w-5 rounded-full bg-neutral-200/50" />
              <div className="h-5 w-5 rounded-full bg-neutral-200/50" />
              <div className="h-5 w-5 rounded-full bg-neutral-200/50" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
