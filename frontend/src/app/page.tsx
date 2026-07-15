import Link from "next/link";
import LiveMarkets from "@/components/LiveMarkets";

export default function LandingPage() {
  return (
    <div className="min-h-full flex flex-col pt-12 sm:pt-20 px-6 sm:px-12 md:px-24 overflow-x-hidden">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6 mt-8 sm:mt-16 mb-12 sm:mb-24">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
          AI Market Intelligence
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium">
          Monitor &middot; Analyze &middot; Predict &middot; Understand
        </p>
        <div className="pt-4">
          <Link
            href="/onboarding"
            className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-8 text-sm font-medium text-accent-foreground shadow transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Live Markets Preview */}
      <LiveMarkets />
    </div>
  );
}
