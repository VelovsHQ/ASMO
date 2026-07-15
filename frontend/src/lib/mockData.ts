export type Trend = "Bullish" | "Bearish" | "Neutral";
export type RiskLevel = "Low" | "Medium" | "High";
export type MomentumLevel = "Low" | "Medium" | "High";

export interface MarketSignal {
  symbol: string;
  name: string;
  score: number; // 0-100
  trend: Trend;
  confidence: number; // 0-100
  risk: RiskLevel;
  momentum: MomentumLevel;
}

const SYMBOL_MAP: Record<string, string> = {
  "Gold": "xauusd",
  "Oil": "wti",
  "Bitcoin": "btc",
  "NASDAQ": "ndx",
  "AI Stocks": "ai-index",
  "Apple": "aapl",
  "Microsoft": "msft",
  "Sri Lankan Stocks": "cse",
  "Forex": "eurusd",
  "Crypto": "total-crypto"
};

export function generateMockMarketSignal(name: string): MarketSignal {
  const score = Math.floor(Math.random() * 100);
  let trend: Trend = "Neutral";
  if (score > 60) trend = "Bullish";
  else if (score < 40) trend = "Bearish";

  const risks: RiskLevel[] = ["Low", "Medium", "High"];
  const momentums: MomentumLevel[] = ["Low", "Medium", "High"];

  return {
    symbol: SYMBOL_MAP[name] || name.toLowerCase().replace(/[^a-z0-9]/g, ''),
    name,
    score,
    trend,
    confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
    risk: risks[Math.floor(Math.random() * risks.length)],
    momentum: momentums[Math.floor(Math.random() * momentums.length)],
  };
}

export interface ImpactedAsset {
  name: string;
  direction: "up" | "down" | "neutral";
}

export interface GlobalEvent {
  id: string;
  severity: "urgent" | "hot" | "watch";
  headline: string;
  impacts: ImpactedAsset[];
}

export function getGlobalEvents(): GlobalEvent[] {
  return [
    {
      id: "e1",
      severity: "urgent",
      headline: "Fed unexpectedly announces 50bps rate cut",
      impacts: [
        { name: "Gold", direction: "up" },
        { name: "NASDAQ", direction: "up" },
        { name: "USD", direction: "down" }
      ]
    },
    {
      id: "e2",
      severity: "hot",
      headline: "OPEC+ slashes oil production targets",
      impacts: [
        { name: "Oil", direction: "up" },
        { name: "S&P 500", direction: "down" }
      ]
    },
    {
      id: "e3",
      severity: "watch",
      headline: "AI regulation bill passes EU parliament",
      impacts: [
        { name: "AI Stocks", direction: "neutral" },
        { name: "Microsoft", direction: "down" }
      ]
    }
  ];
}
