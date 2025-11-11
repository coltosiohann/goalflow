import { AppHeader } from "@/components/AppHeader";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
