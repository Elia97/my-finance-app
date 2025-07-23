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

export function TransfersChart({
  data,
}: {
  data: { name: string; transfers: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="transfers" name="Trasferimenti" fill="#0000FF" />
      </BarChart>
    </ResponsiveContainer>
  );
}
