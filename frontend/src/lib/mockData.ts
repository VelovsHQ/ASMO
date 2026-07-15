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
