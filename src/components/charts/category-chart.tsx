"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export function CategoryChart({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) {
  const filteredData = data.filter((entry) => entry.value > 0);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={filteredData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `€${value}`} />
        <Legend layout="vertical" verticalAlign="middle" align="left" />
      </PieChart>
    </ResponsiveContainer>
  );
}
