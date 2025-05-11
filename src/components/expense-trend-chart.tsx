"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Dati di esempio
const data = [
  { month: "Gen", spese: 1200 },
  { month: "Feb", spese: 1100 },
  { month: "Mar", spese: 1300 },
  { month: "Apr", spese: 1150 },
  { month: "Mag", spese: 1450 },
  { month: "Giu", spese: 1350 },
  { month: "Lug", spese: 1250 },
  { month: "Ago", spese: 1050 },
  { month: "Set", spese: 1200 },
  { month: "Ott", spese: 1300 },
  { month: "Nov", spese: 1400 },
  { month: "Dic", spese: 1600 },
];

export function ExpenseTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Andamento Spese</CardTitle>
        <CardDescription>
          Trend delle spese negli ultimi 12 mesi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="spese"
              stroke="#ef4444"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
