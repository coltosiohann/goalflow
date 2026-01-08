"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { UserPlus, Mail, Lock, Loader2, User, Sparkles, ArrowLeft } from "lucide-react";

// Prevent prerendering - this page needs runtime env vars
export const dynamic = 'force-dynamic';

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (isMounted && user) {
        router.replace("/dashboard");
      }
    };

    void checkSession();

    return () => {
      isMounted = false;
    };
  }, [router, supabase]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        toast.success("Account created! Welcome to GoalFlow!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/40 via-white to-white dark:from-indigo-950/20 dark:via-background dark:to-background">

      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[80px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[80px] -z-10" />

      <div className="container mx-auto flex flex-col items-center justify-center p-4">

        {/* Header/Home Link */}
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/30 mb-6 ring-4 ring-white">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Create Account</h1>
            <p className="mt-2 text-neutral-600">
              Start your transformation journey today
            </p>
          </div>

          <Card className="glass-card border-white/40 shadow-xl">
            <CardContent className="pt-6">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 ml-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="rounded-xl pl-10 h-12 bg-white/50 border-neutral-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 ml-1">
                    Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="rounded-xl pl-10 h-12 bg-white/50 border-neutral-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400 group-focus-within:text-indigo-500 transition-colors" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="rounded-xl pl-10 h-12 bg-white/50 border-neutral-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                      required
                      disabled={loading}
                      minLength={6}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground ml-1">
                    Must be at least 6 characters
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700 transition-all hover:scale-[1.02]"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-neutral-600">Already have an account? </span>
                <Link
                  href="/login"
                  className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-all"
                >
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
