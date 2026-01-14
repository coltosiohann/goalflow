"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { User, Settings, Bell, Shield, Wallet, Camera, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/EmptyState";

type Preferences = {
  difficulty: "beginner" | "intermediate" | "advanced";
  contentType: "mixed" | "video" | "article";
  dailyMinutes: number;
};

type Notifications = {
  weeklySummary: boolean;
  streakReminders: boolean;
  taskPrompts: boolean;
};

export default function AccountPage() {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile"); // profile, preferences, security, billing

  // User State
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [timezone, setTimezone] = useState("");

  // Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Prefs State
  const [preferences, setPreferences] = useState<Preferences>({
    difficulty: "beginner",
    contentType: "mixed",
    dailyMinutes: 45,
  });
  const [notifications, setNotifications] = useState<Notifications>({
    weeklySummary: true,
    streakReminders: true,
    taskPrompts: true,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (data.user) {
          const user = data.user;
          setEmail(user.email || "");
          const meta = user.user_metadata || {};
          setFullName(meta.full_name || "");
          setUsername(meta.username || "");
          setBio(meta.bio || "");
          setTimezone(meta.timezone || "");

          if (meta.preferences) {
            setPreferences(prev => ({ ...prev, ...meta.preferences }));
          }
          if (meta.notifications) {
            setNotifications(prev => ({ ...prev, ...meta.notifications }));
          }
        }
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [supabase]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          username,
          bio,
          timezone,
          preferences,
          notifications
        },
      });
      if (error) throw error;
      toast.success("Changes saved successfully");
    } catch (error) {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const navItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: Wallet },
  ];

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your profile, preferences, and account security.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all whitespace-nowrap",
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "hover:bg-accent text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-6">

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Public Profile</CardTitle>
                  <CardDescription>This is how others will see you on the platform.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Placeholder */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 border-4 border-white shadow-xl flex items-center justify-center">
                      <span className="text-3xl font-bold text-indigo-600">
                        {fullName ? fullName.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>
                    <Button variant="outline" className="gap-2 rounded-xl">
                      <Camera className="h-4 w-4" />
                      Change Avatar
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Username</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">@</span>
                        <Input className="pl-8" value={username} onChange={e => setUsername(e.target.value)} placeholder="johndoe" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bio</label>
                    <Textarea
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="Tell us a bit about yourself..."
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" value={email} disabled />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Timezone</label>
                      <Input value={timezone} onChange={e => setTimezone(e.target.value)} placeholder="UTC" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Learning Customization</CardTitle>
                <CardDescription>Tailor the AI curriculum to your style.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Difficulty Level</label>
                    <Select
                      value={preferences.difficulty}
                      onValueChange={(v: any) => setPreferences(p => ({ ...p, difficulty: v }))}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (Start from scratch)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (I know the basics)</SelectItem>
                        <SelectItem value="advanced">Advanced (Challenge me)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preferred Content Type</label>
                    <Select
                      value={preferences.contentType}
                      onValueChange={(v: any) => setPreferences(p => ({ ...p, contentType: v }))}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mixed">Mixed (Balanced)</SelectItem>
                        <SelectItem value="video">Video First</SelectItem>
                        <SelectItem value="article">Reading First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Daily Goal (Minutes)</label>
                    <div className="flex items-center gap-4">
                      <Input
                        type="number"
                        value={preferences.dailyMinutes}
                        onChange={e => setPreferences(p => ({ ...p, dailyMinutes: Number(e.target.value) }))}
                        className="w-32"
                      />
                      <span className="text-muted-foreground text-sm">minutes per day</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Decide when we should bug you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { k: "weeklySummary", label: "Weekly Progress Summary", desc: "Get a breakdown of your learning every Monday." },
                  { k: "streakReminders", label: "Streak Preservation", desc: "We&apos;ll warn you if you&apos;re about to lose your streak." },
                  { k: "taskPrompts", label: "Daily Task Prompts", desc: "A gentle nudge to start your daily task." }
                ].map((item) => (
                  <div key={item.k} className="flex items-center justify-between p-4 rounded-xl border bg-white/40">
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-sm text-muted-foreground">{item.desc}</div>
                    </div>
                    <Button
                      variant={(notifications as any)[item.k] ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNotifications(prev => ({ ...prev, [item.k]: !(prev as any)[item.k] }))}
                    >
                      {(notifications as any)[item.k] ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Password & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>
                <Button variant="outline" disabled>Update Password</Button>
                <p className="text-xs text-muted-foreground">This is a demo, password updates are disabled.</p>
              </CardContent>
            </Card>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <EmptyState
              icon={Wallet}
              title="No Active Subscription"
              description="You are currently on the free version of GoalFlow."
              action={{ label: "Upgrade to Pro", onClick: () => { } }}
            />
          )}

          {/* Global Save Button - Only show if not on billing/security for now as they are dummy */}
          {["profile", "preferences", "notifications"].includes(activeTab) && (
            <div className="flex justify-end pt-4">
              <Button size="lg" onClick={handleSave} disabled={saving} className="min-w-[150px]">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
