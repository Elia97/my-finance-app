"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

// Dati di esempio
const data = [
  {
    name: "Gen",
    entrate: 2300,
    uscite: 1200,
  },
  {
    name: "Feb",
    entrate: 2300,
    uscite: 1100,
  },
  {
    name: "Mar",
    entrate: 2300,
    uscite: 1300,
  },
  {
    name: "Apr",
    entrate: 2300,
    uscite: 1150,
  },
  {
    name: "Mag",
    entrate: 2300,
    uscite: 1450,
  },
  {
    name: "Giu",
    entrate: 2300,
    uscite: 1350,
  },
];

export function IncomeExpenseComparisonChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrate vs Uscite</CardTitle>
        <CardDescription>
          Confronto tra entrate e uscite mensili
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="entrate" name="Entrate" fill="#22c55e" />
            <Bar dataKey="uscite" name="Uscite" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
