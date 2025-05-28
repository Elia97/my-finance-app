"use client";

import { useForm } from "react-hook-form";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Edit, Plus, Trash2, X } from "lucide-react";
import { Category } from "@/types/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

type NewCategoryForm = {
  name: string;
};

export function CategoriesSettingsForm({
  categories,
  onCategoryAdded,
  onCategoryUpdated,
  onCategoryDeleted,
}: {
  categories: Category[];
  onCategoryAdded: (category: Category) => void;
  onCategoryUpdated: (category: Category) => void;
  onCategoryDeleted: (categoryId: string) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<NewCategoryForm>();

  const [color, setColor] = useState("#60a5fa"); // Default: blue-400
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("#60a5fa");
  const [openConfirmPopoverId, setOpenConfirmPopoverId] = useState<
    string | null
  >(null);

  const startEditing = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditName(category.name);
    setEditColor(category.color ?? "#FFFFFF");
  };

  const saveEdit = async () => {
    if (!editingCategoryId) return;

    try {
      const response = await fetch(`/api/categories/${editingCategoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editName, color: editColor }),
      });

      if (!response.ok) {
        throw new Error("Errore durante l'aggiornamento della categoria");
      }

      const updatedCategory = await response.json();
      onCategoryUpdated(updatedCategory);
      setEditingCategoryId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const cancelEdit = () => {
    setEditingCategoryId(null);
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Errore durante l'eliminazione della categoria");
      }

      onCategoryDeleted(categoryId); // Avvisa il genitore di rimuovere la categoria
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data: NewCategoryForm) => {
    const newCategory = {
      name: data.name,
      color,
    };

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        throw new Error("Errore durante l'aggiunta della categoria");
      }

      const category = await response.json();
      onCategoryAdded(category);
      reset();
      setColor("#60a5fa");
    } catch (error) {
      console.error("Errore:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorie</CardTitle>
        <CardDescription>
          Gestisci le categorie per le tue transazioni.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nuova Categoria</Label>
            <Input
              id="name"
              placeholder="Es. Spese, Risparmi, Investimenti..."
              {...register("name", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label>Colore</Label>
            <div className="flex items-center gap-4">
              <HexColorPicker color={color} onChange={setColor} />
              <div
                className="h-10 w-10 rounded-full border"
                style={{ backgroundColor: color }}
              />
            </div>
          </div>

          <Button type="submit" className="gap-1" disabled={isSubmitting}>
            <Plus className="h-4 w-4" />
            Aggiungi Categoria
          </Button>
        </form>

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
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border"
                        style={{
                          backgroundColor:
                            editingCategoryId === category.id
                              ? editColor
                              : category.color || "#FFFFFF",
                        }}
                      />
                      {editingCategoryId === category.id ? (
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="max-w-xs"
                          autoFocus
                        />
                      ) : (
                        <span>{category.name}</span>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 items-center">
                      {editingCategoryId === category.id ? (
                        <>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-full"
                                aria-label="Selettore colore"
                              >
                                <div
                                  className="h-5 w-5 rounded-full border"
                                  style={{ backgroundColor: editColor }}
                                />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[220px] p-2">
                              <HexColorPicker
                                color={editColor}
                                onChange={setEditColor}
                              />
                            </PopoverContent>
                          </Popover>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={saveEdit}
                            aria-label="Salva modifica"
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={cancelEdit}
                            aria-label="Annulla modifica"
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditing(category)}
                            aria-label="Modifica categoria"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          {/* Popover conferma eliminazione */}
                          <Popover
                            open={openConfirmPopoverId === category.id}
                            onOpenChange={(isOpen) => {
                              if (!isOpen) setOpenConfirmPopoverId(null);
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Elimina categoria"
                                onClick={() =>
                                  setOpenConfirmPopoverId(category.id)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-48 p-4 bg-popover shadow-lg rounded-md">
                              <p className="mb-2 text-sm">
                                Sei sicuro di voler eliminare{" "}
                                <strong>{category.name}</strong>?
                              </p>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setOpenConfirmPopoverId(null)}
                                >
                                  Annulla
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    deleteCategory(category.id);
                                    setOpenConfirmPopoverId(null);
                                  }}
                                >
                                  Elimina
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </>
                      )}
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
      </CardContent>
    </Card>
  );
}
