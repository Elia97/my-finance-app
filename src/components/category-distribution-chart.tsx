"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

// Dati di esempio
const data = [
  { name: "Alimentari", value: 450, color: "#ef4444" },
  { name: "Trasporti", value: 300, color: "#f97316" },
  { name: "Bollette", value: 250, color: "#eab308" },
  { name: "Svago", value: 200, color: "#22c55e" },
  { name: "Salute", value: 150, color: "#3b82f6" },
  { name: "Altro", value: 100, color: "#a855f7" },
];

export function CategoryDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuzione Spese</CardTitle>
        <CardDescription>
          Suddivisione delle spese per categoria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `€${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
