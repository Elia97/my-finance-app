"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PreferencesFormValues, preferencesSchema } from "@/types/schemas";

export function NotificationsSettingsForm({
  preferences,
  onUpdate,
}: {
  preferences: PreferencesFormValues;
  onUpdate?: (updatedPreferences: PreferencesFormValues) => void;
}) {
  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: preferences,
  });

  async function onSubmit(values: PreferencesFormValues) {
    try {
      const response = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Errore durante l'aggiornamento delle preferenze");
      }

      const updatedPreferences = await response.json();
      form.reset(updatedPreferences);
      onUpdate?.(updatedPreferences);
      toast.success("Preferenze aggiornate con successo!");
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error(
        "Si è verificato un errore durante l'aggiornamento delle preferenze."
      );
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardHeader>
            <CardTitle>Preferenze Notifiche</CardTitle>
            <CardDescription>
              Personalizza il tipo di notifiche che desideri ricevere.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="balanceAlerts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Avvisi Saldo</FormLabel>
                    <FormDescription>
                      Ricevi notifiche se il saldo scende sotto una soglia.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budgetAlerts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Avvisi Budget</FormLabel>
                    <FormDescription>
                      Ricevi un avviso se superi il budget mensile.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketingEmails"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Email promozionali
                    </FormLabel>
                    <FormDescription>
                      Ricevi aggiornamenti su funzionalità, novità e consigli.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button type="submit">Salva modifiche</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
