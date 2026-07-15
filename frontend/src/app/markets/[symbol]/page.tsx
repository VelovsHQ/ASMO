"use client";

import { use } from "react";
import { getMockMarketDetail } from "@/lib/mockData";
import MarketPulseScore from "@/components/MarketPulseScore";
import EventTimeline from "@/components/EventTimeline";
import MarketPredictionChart from "@/components/MarketPredictionChart";
import { ChevronRight, ExternalLink, History, Lightbulb, Newspaper, Target } from "lucide-react";

export default function MarketDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const resolvedParams = use(params);
  const detail = getMockMarketDetail(resolvedParams.symbol);

  return (
    <div className="p-6 md:p-10 flex flex-col gap-12 max-w-7xl mx-auto w-full pb-32">
      
      {/* 1. Header & Pulse Score */}
      <section className="flex flex-col gap-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground uppercase">
          {detail.name}
        </h1>
        <div className="max-w-2xl">
          <MarketPulseScore signal={detail} size="full" />
        </div>
      </section>

      {/* 2. AI Summary */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Lightbulb className="text-accent" /> AI Summary
        </h2>
        <div className="flex flex-col gap-3 text-muted-foreground text-lg leading-relaxed max-w-4xl">
          {detail.summary.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </section>

      {/* Grid for Two-Column layout on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column */}
        <div className="flex flex-col gap-12">
          
          {/* 3. Why? / Explainability Box */}
          <section className="flex flex-col gap-4 bg-muted/20 border border-border p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                Why is this happening?
              </h2>
              <div className="flex items-center gap-1 text-sm font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full shrink-0">
                <Target size={14} /> {detail.confidence}% Confident
              </div>
            </div>
            
            <ul className="flex flex-col gap-3 mb-4">
              {detail.drivers.map((driver, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  <span className="text-foreground font-medium">{driver.title}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-border/50">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">
                Supporting Sources
              </span>
              <div className="flex flex-wrap gap-2">
                {detail.sources.map(source => (
                  <span key={source} className="px-3 py-1 bg-background border border-border text-xs font-medium rounded-md text-foreground shadow-sm">
                    {source}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Recent Events Timeline */}
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold tracking-tight">Recent Events</h2>
            <EventTimeline events={detail.timeline} />
          </section>

        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-12">
          
          {/* 5. Predictions */}
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold tracking-tight">Predictions</h2>
            <div className="p-6 border border-border rounded-2xl bg-muted/10 shadow-sm">
              <MarketPredictionChart predictions={detail.predictions} />
            </div>
          </section>

          {/* 6. Related Articles */}
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              <Newspaper size={24} /> Related Articles
            </h2>
            <div className="flex flex-col gap-3">
              {detail.articles.map(article => (
                <div key={article.id} className="p-4 rounded-xl border border-border bg-background hover:bg-muted/30 transition-colors cursor-pointer group flex justify-between items-center shadow-sm">
                  <div className="flex flex-col gap-1 pr-4">
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">{article.source}</span>
                    <h3 className="font-medium text-foreground line-clamp-2">{article.headline}</h3>
                  </div>
                  <ExternalLink size={18} className="text-muted-foreground group-hover:text-foreground shrink-0" />
                </div>
              ))}
            </div>
          </section>

          {/* 7. Historical Similar Events */}
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              <History size={24} /> Historical Context
            </h2>
            <div className="flex flex-col gap-3">
              {detail.similarEvents.map(event => (
                <div key={event.id} className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col gap-2 shadow-sm">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-foreground">{event.title}</h3>
                    <span className="text-xs font-medium text-muted-foreground bg-background px-2 py-1 rounded border border-border">
                      {event.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <ChevronRight size={14} className="text-accent shrink-0" />
                    <span>{event.outcome}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
