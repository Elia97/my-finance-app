"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { UserSettingsForm } from "@/components/user-settings-form";
import { AppearanceSettingsForm } from "@/components/appearance-settings-form";
import { CategoriesSettingsForm } from "@/components/categories-settings-form";
import { NotificationsSettingsForm } from "@/components/notifications-settings-form";

export function SettingsTabs() {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="appearance">Aspetto</TabsTrigger>
        <TabsTrigger value="categories">Categorie</TabsTrigger>
        <TabsTrigger value="notifications">Notifiche</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <UserSettingsForm />
        </Card>
      </TabsContent>
      <TabsContent value="appearance">
        <Card>
          <AppearanceSettingsForm />
        </Card>
      </TabsContent>
      <TabsContent value="categories">
        <Card>
          <CategoriesSettingsForm />
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
