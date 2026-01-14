"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard, Target, User, Compass } from "lucide-react";

export function AppHeader() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-indigo-100/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">
        {/* Logo - Left Aligned */}
        <Link href="/dashboard" className="flex items-center gap-2 group z-20">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <span className="text-lg font-bold text-white">G</span>
          </div>
          <span className="text-xl font-bold text-neutral-900 tracking-tight hidden sm:inline">GoalFlow</span>
        </Link>

        {/* Primary Navigation - Absolutely Centered */}
        <nav className="hidden md:flex items-center gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/dashboard">
            <Button
              variant={isActive("/dashboard") ? "secondary" : "ghost"}
              size="sm"
              className={`gap-2 rounded-xl transition-all ${isActive("/dashboard") ? "bg-indigo-50 text-indigo-700" : "text-neutral-600 hover:text-indigo-600 hover:bg-indigo-50/50"}`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden lg:inline font-medium">Dashboard</span>
            </Button>
          </Link>

          <Link href="/goals/new">
            <Button
              variant={isActive("/goals/new") ? "secondary" : "ghost"}
              size="sm"
              className={`gap-2 rounded-xl transition-all ${isActive("/goals/new") ? "bg-indigo-50 text-indigo-700" : "text-neutral-600 hover:text-indigo-600 hover:bg-indigo-50/50"}`}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden lg:inline font-medium">New Goal</span>
            </Button>
          </Link>
        </nav>

        {/* Actions - Right Aligned (Explore + Profile) */}
        <div className="flex items-center gap-2 md:gap-3 z-20">
          {/* Mobile Only: New Goal Button */}
          <Link href="/goals/new" className="md:hidden">
            <Button
              variant={isActive("/goals/new") ? "secondary" : "ghost"}
              size="icon"
              className={`rounded-xl transition-all ${isActive("/goals/new") ? "bg-indigo-50 text-indigo-700" : "text-neutral-600 hover:text-indigo-600 hover:bg-indigo-50/50"}`}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </Link>

          <Link href="/explore">
            <Button
              variant={isActive("/explore") ? "secondary" : "ghost"}
              size="sm"
              className={`gap-2 rounded-xl transition-all ${isActive("/explore") ? "bg-indigo-50 text-indigo-700" : "text-neutral-600 hover:text-indigo-600 hover:bg-indigo-50/50"}`}
            >
              <Compass className="h-4 w-4" />
              <span className="hidden md:inline font-medium">Explore</span>
            </Button>
          </Link>

          <div className="h-6 w-px bg-neutral-200 mx-1"></div>

          <Link href="/account" className="flex items-center">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-indigo-50 text-neutral-600 hover:text-indigo-600">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
