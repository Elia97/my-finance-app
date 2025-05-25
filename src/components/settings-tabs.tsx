"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { UserSettingsForm } from "@/components/user-settings-form";
import { CategoriesSettingsForm } from "@/components/categories-settings-form";
import { NotificationsSettingsForm } from "@/components/notifications-settings-form";
import { UserWithRelations } from "@/types/types";

export function SettingsTabs({ userId }: { userId: string }) {
  const [user, setUser] = useState<UserWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (!response.ok) {
          throw new Error("Errore nel recupero dei dati dell'utente");
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [userId]);

  if (loading) {
    return <div>Caricamento...</div>;
  }

  if (error) {
    return (
      <div>
        Errore:{" "}
        {error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Si è verificato un errore sconosciuto."}
      </div>
    );
  }

  if (!user) {
    return <div>Utente non trovato</div>;
  }

  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="categories">Categorie</TabsTrigger>
        <TabsTrigger value="notifications">Notifiche</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>{user && <UserSettingsForm user={user} />}</Card>
      </TabsContent>
      <TabsContent value="categories">
        <Card>
          <CategoriesSettingsForm categories={user.categories} />
        </Card>
      </TabsContent>
      <TabsContent value="notifications">
        <Card>
          <NotificationsSettingsForm />
        </Card>
      </TabsContent>
    </Tabs>
  );
}
