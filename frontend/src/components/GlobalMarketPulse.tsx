import { getGlobalEvents, GlobalEvent } from "@/lib/mockData";
import { ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import React from "react";

const severityConfig = {
  urgent: { icon: "🚨", bg: "bg-red-500/10", border: "border-red-500/20" },
  hot: { icon: "🔥", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  watch: { icon: "⚠️", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
};

export default function GlobalMarketPulse() {
  const events = getGlobalEvents();

  return (
    <section className="flex flex-col gap-4 mt-2">
      <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2 text-foreground">
        <span>🌍</span> Global Market Pulse
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}

function EventCard({ event }: { event: GlobalEvent }) {
  const config = severityConfig[event.severity];

  return (
    <div className={`flex flex-col p-4 rounded-xl border ${config.border} ${config.bg} relative overflow-hidden transition-colors hover:bg-muted/50`}>
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5" aria-hidden="true">{config.icon}</span>
        <div className="flex flex-col gap-3 w-full">
          <h3 className="font-semibold text-foreground leading-tight text-sm sm:text-base">{event.headline}</h3>
          
          <div className="flex flex-col gap-1.5 mt-auto pt-2 border-t border-border/50">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Affects:</span>
            <div className="flex flex-wrap items-center text-sm font-medium">
              {event.impacts.map((impact, i) => (
                <React.Fragment key={i}>
                  <div className="flex items-center gap-1">
                    <span className="text-foreground">{impact.name}</span>
                    {impact.direction === "up" && <ArrowUp size={14} className="text-bullish" />}
                    {impact.direction === "down" && <ArrowDown size={14} className="text-bearish" />}
                    {impact.direction === "neutral" && <ArrowRight size={14} className="text-neutral" />}
                  </div>
                  {i < event.impacts.length - 1 && (
                    <span className="text-muted-foreground/50 mx-2 text-xs">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
