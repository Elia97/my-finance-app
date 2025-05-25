"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

export function CategoryChart({
  data,
}: {
  data: { name: string; value: number; color: string }[];
}) {
  const isMobile = useIsMobile();
  const filteredData = data.filter((entry) => entry.value > 0);
  return (
    <ResponsiveContainer width="100%" height={400}>
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
        {/* <Legend layout="vertical" verticalAlign="middle" align="left" /> */}
        <Legend
          layout={isMobile ? "horizontal" : "vertical"}
          verticalAlign={isMobile ? "bottom" : "middle"}
          align="left"
          className="mt-4"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
