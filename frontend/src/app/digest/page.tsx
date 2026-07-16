"use client";

import { FileText } from "lucide-react";

export default function DigestPage() {
  return (
    <div className="p-6 md:p-10 flex flex-col gap-8 max-w-4xl mx-auto w-full pb-32">
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent/10 text-accent rounded-xl border border-accent/20">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Today's Summary
            </h1>
            <p className="text-muted-foreground mt-1">
              Your AI-generated daily market digest
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="p-6 border border-border bg-background rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Executive Summary</h2>
            <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
          
          <div className="space-y-4 text-foreground leading-relaxed">
            <p>
              Markets are showing mixed signals today. The technology sector continues to demonstrate resilience despite macroeconomic headwinds, while energy stocks are seeing increased volatility due to geopolitical tensions.
            </p>
            <p>
              <strong>Key Takeaways:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Global indices remain largely flat heading into the afternoon session.</li>
              <li>Tech stocks are outperforming, driven by positive earnings revisions in the AI sector.</li>
              <li>Commodities are experiencing slight pullbacks, with gold finding resistance at recent highs.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
