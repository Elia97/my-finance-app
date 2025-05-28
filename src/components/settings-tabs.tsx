"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserSettingsForm } from "@/components/user-settings-form";
import { CategoriesSettingsForm } from "@/components/categories-settings-form";
import { NotificationsSettingsForm } from "@/components/notifications-settings-form";
import { Category, UserWithRelations } from "@/types/types";

export function SettingsTabs({ userId }: { userId: string }) {
  const [user, setUser] = useState<UserWithRelations | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") ?? "account";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tabFromURL = searchParams.get("tab");
    if (tabFromURL && tabFromURL !== activeTab) {
      setActiveTab(tabFromURL);
    }
  }, [searchParams, activeTab]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("api/user/me");
        if (!response.ok) {
          throw new Error("Errore nel recupero dei dati dell'utente");
        }
        const data = await response.json();
        setUser(data);
        setCategories(data.categories);
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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="categories">Categorie</TabsTrigger>
        <TabsTrigger value="notifications">Notifiche</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <UserSettingsForm
          user={user}
          onUpdate={(updatedFields) =>
            setUser((prev) => (prev ? { ...prev, ...updatedFields } : prev))
          }
        />
      </TabsContent>
      <TabsContent value="categories">
        <CategoriesSettingsForm
          categories={categories}
          onCategoryAdded={(newCategory) =>
            setCategories((prev) => [...prev, newCategory])
          }
          onCategoryUpdated={(updatedCategory) =>
            setCategories((prev) =>
              prev.map((cat) =>
                cat.id === updatedCategory.id ? updatedCategory : cat
              )
            )
          }
          onCategoryDeleted={(deletedCategoryId) =>
            setCategories((prev) =>
              prev.filter((cat) => cat.id !== deletedCategoryId)
            )
          }
        />
      </TabsContent>
      <TabsContent value="notifications">
        <NotificationsSettingsForm
          preferences={{
            balanceAlerts: user.preferences?.balanceAlerts ?? false,
            budgetAlerts: user.preferences?.budgetAlerts ?? false,
            marketingEmails: user.preferences?.marketingEmails ?? false,
          }}
          onUpdate={(updatedPreferences) =>
            setUser((prev) =>
              prev && prev.preferences
                ? {
                    ...prev,
                    preferences: {
                      ...prev.preferences,
                      ...updatedPreferences,
                    },
                  }
                : prev
            )
          }
        />
      </TabsContent>
    </Tabs>
  );
}
