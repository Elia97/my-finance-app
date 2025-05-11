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
    spese: 1200,
    trasferimenti: 300,
  },
  {
    name: "Feb",
    spese: 1100,
    trasferimenti: 300,
  },
  {
    name: "Mar",
    spese: 1300,
    trasferimenti: 400,
  },
  {
    name: "Apr",
    spese: 1150,
    trasferimenti: 300,
  },
  {
    name: "Mag",
    spese: 1450,
    trasferimenti: 500,
  },
];

export function MonthlyExpenseChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Andamento Spese</CardTitle>
        <CardDescription>Spese e trasferimenti mensili</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="spese" name="Spese" fill="#ef4444" />
            <Bar dataKey="trasferimenti" name="Trasferimenti" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
