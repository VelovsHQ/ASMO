import { MarketSignal } from "@/lib/mockData";
import { TrendingUp, TrendingDown, Minus, Activity, ShieldAlert, Target } from "lucide-react";

interface MarketPulseScoreProps {
  signal: MarketSignal;
  size?: "compact" | "full";
}

export default function MarketPulseScore({ signal, size = "compact" }: MarketPulseScoreProps) {
  const isCompact = size === "compact";
  
  const isBullish = signal.trend === "Bullish";
  const isBearish = signal.trend === "Bearish";
  
  const colorClass = isBullish 
    ? "text-bullish" 
    : isBearish 
      ? "text-bearish" 
      : "text-neutral";

  const bgClass = isBullish 
    ? "bg-bullish" 
    : isBearish 
      ? "bg-bearish" 
      : "bg-neutral";

  return (
    <div className={`flex flex-col ${isCompact ? "p-4 gap-3" : "p-6 gap-6"} rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors w-full h-full`}>
      {/* Header: Name and Trend Icon */}
      <div className="flex justify-between items-start">
        <h3 className={`font-semibold text-foreground ${isCompact ? "text-base" : "text-2xl"}`}>
          {signal.name}
        </h3>
        <div className={`flex items-center gap-1 ${colorClass}`}>
          {isBullish && <TrendingUp size={isCompact ? 16 : 24} />}
          {isBearish && <TrendingDown size={isCompact ? 16 : 24} />}
          {!isBullish && !isBearish && <Minus size={isCompact ? 16 : 24} />}
          {!isCompact && <span className="font-medium text-sm ml-1">{signal.trend}</span>}
        </div>
      </div>

      {/* Score and Bar */}
      <div className="flex flex-col gap-2 mt-auto">
        <div className="flex items-end gap-2">
          <span className={`font-bold tracking-tighter ${isCompact ? "text-4xl" : "text-6xl"} ${colorClass}`}>
            {signal.score}
          </span>
          <span className="text-muted-foreground text-sm font-medium mb-1">/100 Pulse</span>
        </div>
        
        {/* Horizontal Gauge Bar */}
        <div className={`w-full bg-muted rounded-full overflow-hidden ${isCompact ? "h-2" : "h-3"}`}>
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${bgClass}`}
            style={{ width: `${signal.score}%` }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className={`grid grid-cols-3 gap-2 ${isCompact ? "mt-2" : "mt-4"} text-xs sm:text-sm border-t border-border/50 pt-3`}>
        {/* Confidence */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Target size={12} />
            <span className="uppercase text-[10px] tracking-wider font-semibold">Conf</span>
          </div>
          <span className="font-medium text-foreground">{signal.confidence}%</span>
        </div>

        {/* Risk */}
        <div className="flex flex-col gap-1 border-l border-border/50 pl-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <ShieldAlert size={12} />
            <span className="uppercase text-[10px] tracking-wider font-semibold">Risk</span>
          </div>
          <span className={`font-medium ${signal.risk === "High" ? "text-bearish" : signal.risk === "Low" ? "text-bullish" : "text-neutral"}`}>
            {signal.risk}
          </span>
        </div>

        {/* Momentum */}
        <div className="flex flex-col gap-1 border-l border-border/50 pl-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Activity size={12} />
            <span className="uppercase text-[10px] tracking-wider font-semibold">Mom</span>
          </div>
          <span className="font-medium text-foreground">{signal.momentum}</span>
        </div>
      </div>
    </div>
  );
}
