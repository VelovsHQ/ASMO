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

export interface MarketDriver {
  title: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  description: string;
}

export interface PredictionDataPoint {
  time: string;
  value: number;
}

export interface MarketPrediction {
  timeframe: "24h" | "7d" | "30d";
  direction: "up" | "down" | "neutral";
  data: PredictionDataPoint[];
}

export interface Article {
  id: string;
  headline: string;
  source: string;
}

export interface SimilarEvent {
  id: string;
  title: string;
  date: string;
  outcome: string;
}

export interface MarketDetail extends MarketSignal {
  summary: string[];
  drivers: MarketDriver[];
  sources: string[];
  timeline: TimelineEvent[];
  predictions: MarketPrediction[];
  articles: Article[];
  similarEvents: SimilarEvent[];
}

export function getMockMarketDetail(symbol: string): MarketDetail {
  const decodedSymbol = decodeURIComponent(symbol).toUpperCase();
  // Reverse lookup name from symbol map, or just use symbol as name
  const name = Object.keys(SYMBOL_MAP).find(key => SYMBOL_MAP[key] === decodedSymbol.toLowerCase()) || decodedSymbol;
  
  const signal = generateMockMarketSignal(name);
  
  return {
    ...signal,
    summary: [
      `${signal.name} is currently showing a ${signal.trend.toLowerCase()} trend driven by recent macroeconomic shifts and sector-specific catalysts. Institutional volume has seen an uptick over the last 48 hours.`,
      "Analysts point to underlying momentum gathering pace, suggesting the current price level might serve as a strong pivot point for the short to medium term."
    ],
    drivers: [
      { title: "Inflation Data Release" },
      { title: "Central Bank Buying" },
      { title: "Weak Dollar" }
    ],
    sources: ["Reuters", "Bloomberg", "CNBC", "WSJ"],
    timeline: [
      { id: "t1", timestamp: "10:42", description: "Fed Speech Commences" },
      { id: "t2", timestamp: "10:44", description: "Dollar Index Drops 0.2%" },
      { id: "t3", timestamp: "10:47", description: `${signal.name} breaks resistance` },
      { id: "t4", timestamp: "10:49", description: "ASMO Prediction Updated" }
    ],
    predictions: [
      {
        timeframe: "24h", direction: "up", data: Array.from({length: 24}, (_, i) => ({ time: `${i}:00`, value: 100 + Math.random() * 10 + i * 0.5 }))
      },
      {
        timeframe: "7d", direction: "up", data: Array.from({length: 7}, (_, i) => ({ time: `Day ${i+1}`, value: 100 + Math.random() * 20 + i * 2 }))
      },
      {
        timeframe: "30d", direction: "neutral", data: Array.from({length: 30}, (_, i) => ({ time: `Day ${i+1}`, value: 100 + Math.sin(i/3)*10 + Math.random()*5 }))
      }
    ],
    articles: [
      { id: "a1", headline: `${signal.name} surges as new data changes outlook`, source: "Bloomberg" },
      { id: "a2", headline: `What the latest Fed minutes mean for ${signal.name}`, source: "Reuters" },
      { id: "a3", headline: "Market Analysis: Short squeeze potential", source: "CNBC" }
    ],
    similarEvents: [
      { id: "s1", title: "2023 Q2 Tech Rally", date: "May 2023", outcome: "Price increased 14% over 3 weeks" },
      { id: "s2", title: "Post-CPI Shock", date: "August 2022", outcome: "Consolidation phase lasting 2 months" }
    ]
  };
}
