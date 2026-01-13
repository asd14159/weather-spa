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

import type { ChartDataItem } from "@/types/chart";

type WeatherChartProps = {
    title: string;
    data: ChartDataItem[];
    unit: string;
    legendName: string;
};

export function WeatherChart({ title, data, unit, legendName }: WeatherChartProps) {
  return (
    <div style={{ width: "100%", height: 400 }}>
      <h2>{title}</h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="time" />
          <YAxis
            tickFormatter={(v) => `${v}${unit}`}
          />

          <Tooltip
            formatter={(value) => `${value}${unit}`}
          />

          <Line
            type="monotone"
            dataKey="value"
            name={legendName}
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
          <Legend/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}