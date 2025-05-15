"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function MonthlyChart({
  data,
}: {
  data: { name: string; income: number; expenses: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="income" name="Entrate" fill="#22c55e" />
        <Bar dataKey="expenses" name="Uscite" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  );
}
