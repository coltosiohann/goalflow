import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroDemo } from "./_components/HeroDemo";
import { HowItWorks } from "./_components/HowItWorks";
import { Features } from "./_components/Features";
import { Testimonials } from "./_components/Testimonials";
import { CtaBand } from "./_components/CtaBand";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <span className="text-lg font-bold text-white">G</span>
            </div>
            <span className="text-xl font-bold text-neutral-900">GoalFlow</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
            >
              Testimonials
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/signin">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="rounded-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>
        <HeroDemo />
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <div id="features">
          <Features />
        </div>
        <div id="testimonials">
          <Testimonials />
        </div>
        <CtaBand />
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                  <span className="text-lg font-bold text-white">G</span>
                </div>
                <span className="text-xl font-bold text-neutral-900">
                  GoalFlow
                </span>
              </div>
              <p className="text-sm text-neutral-600">
                Turning ambition into action, one goal at a time.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold text-neutral-900">
                Product
              </h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>
                  <Link href="#" className="hover:text-neutral-900">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-neutral-900">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-neutral-900">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold text-neutral-900">
                Company
              </h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>
                  <Link href="#" className="hover:text-neutral-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-neutral-900">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-neutral-900">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold text-neutral-900">
                Legal
              </h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>
                  <Link href="#" className="hover:text-neutral-900">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-neutral-900">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-neutral-200 pt-8 text-center text-sm text-neutral-600">
            © 2025 GoalFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
