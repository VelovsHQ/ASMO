import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutDashboard, LineChart, Newspaper, List, Bell, Search, Settings, MessageSquare } from "lucide-react";
import Link from "next/link";
import SignupPrompt from "@/components/SignupPrompt";
import CopilotChat from "@/components/CopilotChat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ASMO | Enterprise Dashboard",
  description: "Clean enterprise dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex h-screen overflow-hidden bg-background text-foreground">
        {/* Left Sidebar Nav */}
        <aside className="w-64 border-r border-border bg-muted/30 flex flex-col h-full">
          <div className="p-6">
            <h2 className="text-2xl font-bold tracking-tight">
              <Link href="/">ASMO</Link>
            </h2>
          </div>
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavItem href="/markets" icon={<LineChart size={20} />} label="Markets" />
            <NavItem href="/news" icon={<Newspaper size={20} />} label="News" />
            <NavItem href="/watchlists" icon={<List size={20} />} label="Watchlists" />
            <NavItem href="/alerts" icon={<Bell size={20} />} label="Alerts" />
            <div className="pt-4 pb-2">
              <div className="h-px bg-border w-full" />
            </div>
            {/* Search route isn't created but icon was requested */}
            <NavItem href="#" icon={<Search size={20} />} label="Search" />
            <NavItem href="/settings" icon={<Settings size={20} />} label="Settings" />
          </nav>
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
                U
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">User Account</span>
                <Link href="/profile" className="text-xs text-muted-foreground hover:text-foreground">View Profile</Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 relative h-full overflow-y-auto">
          {children}
          
          {/* Persistent Floating Chat */}
          <CopilotChat isFloating={true} />

          <SignupPrompt />
        </main>
      </body>
    </html>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}
