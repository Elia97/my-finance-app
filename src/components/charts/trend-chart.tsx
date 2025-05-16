"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function TrendChart({
  data,
}: {
  data: { month: string; expenses: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="expenses"
          stroke="#ef4444"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
