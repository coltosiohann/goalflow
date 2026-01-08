"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard, Target, User } from "lucide-react";

export function AppHeader() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <span className="text-lg font-bold text-white">G</span>
          </div>
          <span className="text-xl font-bold text-neutral-900">GoalFlow</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button
              variant={isActive("/dashboard") ? "secondary" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
          <Link href="/goals/new">
            <Button
              variant={isActive("/goals/new") ? "secondary" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Goals</span>
            </Button>
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/goals/new">
            <Button size="sm" className="gap-2 rounded-lg">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Goal</span>
            </Button>
          </Link>

          <Link href="/account" className="flex items-center">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
