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
  data: { name: string; expenses: number; transfers: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="expenses" name="Uscite" fill="#ef4444" />
        <Bar dataKey="transfers" name="Trasferimenti" fill="#155dfc" />
      </BarChart>
    </ResponsiveContainer>
  );
}
