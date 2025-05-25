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

export function IncomeExpenseComparisonChart({
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
        <Bar dataKey="income" name="Entrate" fill="#008000" />
        <Bar dataKey="expenses" name="Uscite" fill="#FF0000" />
      </BarChart>
    </ResponsiveContainer>
  );
}
