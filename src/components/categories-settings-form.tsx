"use client";

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
import { Edit, Plus, Trash2 } from "lucide-react";
import { Category } from "@/types/types";

export function CategoriesSettingsForm({
  categories,
}: {
  categories: Category[];
}) {
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
              <Input id="new-category" placeholder="Nome categoria" />
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                Aggiungi
              </Button>
            </div>
          </div>

          {categories.length > 0 ? (
            <div className="space-y-2">
              <Label>Categorie Esistenti</Label>
              <div className="rounded-md border">
                <div className="grid grid-cols-2 gap-4 p-4 font-medium">
                  <div>Nome</div>
                  <div className="text-right">Azioni</div>
                </div>
                <div className="divide-y">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="grid grid-cols-2 gap-4 p-4 items-center"
                    >
                      <div>{category.name}</div>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Modifica</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Elimina</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">
              Nessuna categoria disponibile. Aggiungi una nuova categoria per
              iniziare.
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {categories.length > 0 && <Button>Salva modifiche</Button>}
      </CardFooter>
    </>
  );
}
