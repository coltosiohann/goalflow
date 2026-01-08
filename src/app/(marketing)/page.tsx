import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hero } from "./_components/Hero";
import { HowItWorks } from "./_components/HowItWorks";
import { Features } from "./_components/Features";
import { Testimonials } from "./_components/Testimonials";
import { CtaBand } from "./_components/CtaBand";
import { ArrowRight, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-indigo-500/20 selection:text-indigo-700">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-white to-white dark:from-indigo-950/20 dark:via-background dark:to-background pointer-events-none" />

      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-white/20 bg-white/70 backdrop-blur-xl shadow-sm supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-900">GoalFlow</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-indigo-600"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-indigo-600"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-indigo-600"
            >
              Testimonials
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hidden text-neutral-600 hover:bg-indigo-50 hover:text-indigo-900 sm:flex rounded-xl">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="rounded-xl px-5 font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 bg-indigo-600 hover:bg-indigo-700 text-white">
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
      <footer className="border-t border-indigo-100/50 bg-white/50 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="md:col-span-1">
              <Link href="/" className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600">
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
                  <Link href="#features" className="transition-colors hover:text-indigo-600">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="transition-colors hover:text-indigo-600">
                    How It Works
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
                  <Link href="#" className="transition-colors hover:text-indigo-600">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-indigo-600">
                    Blog
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
                  <Link href="#" className="transition-colors hover:text-indigo-600">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-indigo-600">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center justify-between border-t border-indigo-100/50 pt-8 sm:flex-row">
            <div className="text-sm text-neutral-500">
              © {new Date().getFullYear()} GoalFlow. All rights reserved.
            </div>
            <div className="mt-4 flex gap-6 sm:mt-0">
              {/* Social placeholders */}
              <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-300 hover:bg-indigo-100 hover:text-indigo-500 transition-colors cursor-pointer">
                <span className="sr-only">Twitter</span>
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
              </div>
              <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-300 hover:bg-indigo-100 hover:text-indigo-500 transition-colors cursor-pointer">
                <span className="sr-only">GitHub</span>
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
