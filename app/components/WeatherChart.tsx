"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts"

import type { ChartDataItem } from "types/chart";

type WeatherChartProps = {
  title: string;
  data: ChartDataItem[];
  unit: string;
};

function formatTimeLabel(v: unknown) {
  if(typeof v !== "string") return "";
  if(v.includes("T")) {
    return `${v.slice(5,10)} ${v.slice(11,16)}`;
  }
  return v.slice(5);
}

const LINE_DEFINITIONS: {
  key: keyof ChartDataItem;
  label: string;
  color: string;
}[] = [
  { key: "temperature", label: "気温", color: "#f1802f"},
  { key: "apparent", label: "体感温度", color: "#ec218a" },
  { key: "rain", label: "降水量", color: "#3b82f6" },
  { key: "wind", label: "風速", color: "#9d16cf" },
  { key: "temp_max", label: "最高気温", color: "#ef4444" },
  { key: "temp_min", label: "最低気温", color: "#0ea5e9" },
];

export function WeatherChart({ title, data, unit }: WeatherChartProps) {
  if(data.length === 0) return null;

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h2>{title}</h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis 
            dataKey="time"
            tickFormatter={formatTimeLabel}
          />
          <YAxis
            tickFormatter={(v) => `${v}${unit}`}
          />

          <Tooltip
            formatter={(value) => `${value}${unit}`}
            labelFormatter={formatTimeLabel}
          />

          {LINE_DEFINITIONS.map((line) =>
            data.some((d) => d[line.key] !== undefined) ? (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.label}
                stroke={line.color}
                strokeWidth={2}
                dot={false}
              />
            ): null
          )}

          <Legend/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}