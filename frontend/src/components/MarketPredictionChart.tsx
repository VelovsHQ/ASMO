"use client";

import { useState } from "react";
import { MarketPrediction } from "@/lib/mockData";
import ReactECharts from "echarts-for-react";
import { ArrowUp, ArrowDown, ArrowRight } from "lucide-react";

export default function MarketPredictionChart({ predictions }: { predictions: MarketPrediction[] }) {
  const [activeTab, setActiveTab] = useState<"24h" | "7d" | "30d">("24h");
  
  const activePrediction = predictions.find(p => p.timeframe === activeTab) || predictions[0];
  
  const option = {
    grid: { top: 10, right: 10, bottom: 20, left: 10, containLabel: false },
    xAxis: {
      type: "category",
      data: activePrediction.data.map(d => d.time),
      show: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "#a1a1aa", fontSize: 10, margin: 8 },
      splitLine: { show: false }
    },
    yAxis: {
      type: "value",
      show: false,
      min: "dataMin",
      max: "dataMax"
    },
    series: [
      {
        data: activePrediction.data.map(d => d.value),
        type: "line",
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: activePrediction.direction === "up" ? "#22c55e" : activePrediction.direction === "down" ? "#ef4444" : "#eab308",
          width: 2
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: activePrediction.direction === "up" ? "rgba(34, 197, 94, 0.2)" : activePrediction.direction === "down" ? "rgba(239, 68, 68, 0.2)" : "rgba(234, 179, 8, 0.2)" },
              { offset: 1, color: "rgba(0, 0, 0, 0)" }
            ]
          }
        }
      }
    ],
    tooltip: {
      trigger: "axis",
      backgroundColor: "#18181b",
      borderColor: "#27272a",
      textStyle: { color: "#fafafa" },
      formatter: function (params: any) {
        return `${params[0].axisValue}<br/><strong>${params[0].value.toFixed(2)}</strong>`;
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex bg-muted/30 p-1 rounded-lg self-start">
        {predictions.map(p => (
          <button
            key={p.timeframe}
            onClick={() => setActiveTab(p.timeframe)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === p.timeframe
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {p.timeframe === "24h" ? "24 Hours" : p.timeframe === "7d" ? "7 Days" : "30 Days"}
          </button>
        ))}
      </div>
      
      {/* Directional Label */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Forecast:</span>
        <div className="flex items-center gap-1 font-bold">
          {activePrediction.direction === "up" && <><span className="text-bullish">Bullish</span><ArrowUp size={16} className="text-bullish" /></>}
          {activePrediction.direction === "down" && <><span className="text-bearish">Bearish</span><ArrowDown size={16} className="text-bearish" /></>}
          {activePrediction.direction === "neutral" && <><span className="text-neutral">Neutral</span><ArrowRight size={16} className="text-neutral" /></>}
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-48 w-full -ml-2">
        <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
      </div>
    </div>
  );
}
