import { TimelineEvent } from "@/lib/mockData";

export default function EventTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="flex flex-col gap-0 relative">
      {/* Vertical line */}
      <div className="absolute left-[61px] top-3 bottom-3 w-px bg-border" />
      
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-4 relative z-10 group min-h-[3rem]">
          <div className="w-12 text-right pt-0.5 shrink-0">
            <span className="text-xs font-mono font-semibold text-muted-foreground">{event.timestamp}</span>
          </div>
          <div className="relative flex flex-col justify-start pt-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-background border-2 border-accent transition-colors group-hover:bg-accent ring-4 ring-background" />
          </div>
          <div className="flex-1 pb-4 pt-0">
            <p className="text-sm font-medium text-foreground">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
