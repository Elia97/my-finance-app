"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

// Dati di esempio
const savingsGoals = [
  {
    id: 1,
    name: "Vacanza",
    target: 3000,
    current: 1500,
    deadline: new Date("2023-12-31"),
  },
  {
    id: 2,
    name: "Nuovo Computer",
    target: 1500,
    current: 750,
    deadline: new Date("2023-10-15"),
  },
  {
    id: 3,
    name: "Fondo Emergenza",
    target: 10000,
    current: 4000,
    deadline: null,
  },
];

export function SavingsGoalProgress() {
  const [goals] = useState(savingsGoals);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Obiettivi di Risparmio</CardTitle>
          <CardDescription>
            Progressi verso i tuoi obiettivi finanziari
          </CardDescription>
        </div>
        <Button size="sm" className="gap-1">
          <Plus className="h-4 w-4" />
          Nuovo
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{goal.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {goal.deadline
                      ? `Scadenza: ${goal.deadline.toLocaleDateString("it-IT")}`
                      : "Nessuna scadenza"}
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Modifica</span>
                </Button>
              </div>
              <Progress value={(goal.current / goal.target) * 100} />
              <div className="flex justify-between text-xs">
                <span>
                  {formatCurrency(goal.current)} di{" "}
                  {formatCurrency(goal.target)}
                </span>
                <span className="font-medium">
                  {Math.round((goal.current / goal.target) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
