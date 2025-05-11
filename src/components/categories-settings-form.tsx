"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Dati di esempio
const initialCategories = [
  { id: 1, name: "Alimentari", type: "expense" },
  { id: 2, name: "Trasporti", type: "expense" },
  { id: 3, name: "Bollette", type: "expense" },
  { id: 4, name: "Svago", type: "expense" },
  { id: 5, name: "Salute", type: "expense" },
  { id: 6, name: "Stipendio", type: "income" },
  { id: 7, name: "Freelance", type: "income" },
  { id: 8, name: "Investimenti", type: "income" },
  { id: 9, name: "Regali", type: "income" },
];

export function CategoriesSettingsForm() {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryType, setNewCategoryType] = useState("expense");

  const handleAddCategory = () => {
    if (newCategory.trim() === "") {
      toast.error("Errore", {
        description: "Il nome della categoria non può essere vuoto.",
      });
      return;
    }

    const newId = Math.max(...categories.map((c) => c.id)) + 1;
    setCategories([
      ...categories,
      { id: newId, name: newCategory, type: newCategoryType },
    ]);
    setNewCategory("");
    toast.success("Categoria aggiunta", {
      description: `La categoria "${newCategory}" è stata aggiunta con successo.`,
    });
  };

  const handleDeleteCategory = (id: number) => {
    const categoryToDelete = categories.find((c) => c.id === id);
    setCategories(categories.filter((c) => c.id !== id));
    toast.success("Categoria eliminata", {
      description: `La categoria "${categoryToDelete?.name}" è stata eliminata con successo.`,
    });
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Categorie</CardTitle>
        <CardDescription>
          Gestisci le categorie per le tue transazioni.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-category">Aggiungi Categoria</Label>
            <div className="flex gap-2">
              <Input
                id="new-category"
                placeholder="Nome categoria"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Select
                value={newCategoryType}
                onValueChange={(value) => setNewCategoryType(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Spesa</SelectItem>
                  <SelectItem value="income">Entrata</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddCategory} className="gap-1">
                <Plus className="h-4 w-4" />
                Aggiungi
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categorie Esistenti</Label>
            <div className="rounded-md border">
              <div className="grid grid-cols-3 gap-4 p-4 font-medium">
                <div>Nome</div>
                <div>Tipo</div>
                <div className="text-right">Azioni</div>
              </div>
              <div className="divide-y">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="grid grid-cols-3 gap-4 p-4 items-center"
                  >
                    <div>{category.name}</div>
                    <div>
                      <Badge
                        variant={
                          category.type === "expense"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {category.type === "expense" ? "Spesa" : "Entrata"}
                      </Badge>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Modifica</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Elimina</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Annulla</Button>
        <Button>Salva modifiche</Button>
      </CardFooter>
    </>
  );
}
