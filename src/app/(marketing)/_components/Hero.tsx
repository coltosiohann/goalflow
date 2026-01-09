import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Trophy } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-8 md:pt-16 lg:pt-24 pb-16 lg:pb-24">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[100px] -z-10 animate-pulse translate-x-1/2 -translate-y-1/4" style={{ animationDuration: '4s' }} />

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left Column: Text Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-4 py-1.5 text-sm font-semibold text-indigo-600 backdrop-blur-sm mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
              GoalFlow 2.0 is here
              <ArrowRight className="h-3.5 w-3.5" />
            </div>

            <h1 className="mb-6 max-w-4xl text-5xl font-extrabold tracking-tight text-neutral-900 md:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Turn your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Ambitions</span> into <br className="hidden md:block" />
              <span className="relative inline-block">
                <span className="relative z-10">Actionable Plans</span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-indigo-200/50 -z-0 rotate-1 rounded-full"></span>
              </span>
            </h1>

            <p className="mb-8 max-w-xl text-lg text-neutral-600 md:text-xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              Stop dreaming and start doing. Our AI breaks down your biggest goals into bite-sized, daily tasks that adapt to your pace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              <Link href="/signup">
                <Button size="lg" className="h-14 rounded-2xl px-8 text-lg font-semibold shadow-xl shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 hover:scale-105 transition-all w-full sm:w-auto">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg" className="h-14 rounded-2xl px-8 text-lg bg-white/50 backdrop-blur-sm border-indigo-100 text-neutral-700 hover:bg-white hover:text-indigo-600 w-full sm:w-auto">
                  See How It Works
                </Button>
              </Link>
            </div>

            {/* Social Proof (Small) */}
            <div className="mt-8 flex items-center gap-4 text-sm text-neutral-500 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-neutral-200" />
                ))}
              </div>
              <div>Trusted by 10k+ achievers</div>
            </div>
          </div>

          {/* Right Column: Hero Image */}
          <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/5 rounded-full blur-[60px] -z-10" />
            <Image
              src="/hero-phones.png"
              alt="GoalFlow Mobile Interface"
              width={800}
              height={600}
              priority
              className="w-full h-auto drop-shadow-2xl hover:scale-[1.01] transition-transform duration-700 object-contain"
            />
          </div>

        </div>

        {/* Stats Section - Moved below grid */}
        <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-3 lg:max-w-4xl lg:mx-auto border-t border-indigo-100/50 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-neutral-900">10k+</span>
            <span className="text-sm text-neutral-500">Active Goal Setters</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-neutral-900">1M+</span>
            <span className="text-sm text-neutral-500">Tasks Completed</span>
          </div>
          <div className="hidden md:flex flex-col items-center">
            <span className="text-3xl font-bold text-neutral-900">4.9/5</span>
            <span className="text-sm text-neutral-500">User Rating</span>
          </div>
        </div>
      </div>
    </section>
  );
}
