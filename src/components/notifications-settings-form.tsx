"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const notificationsFormSchema = z.object({
  transactionNotifications: z.boolean(),
  balanceAlerts: z.boolean(),
  budgetAlerts: z.boolean(),
  goalNotifications: z.boolean(),
  marketingEmails: z.boolean(),
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

// Dati di esempio
const defaultValues: NotificationsFormValues = {
  transactionNotifications: true,
  balanceAlerts: true,
  budgetAlerts: true,
  goalNotifications: true,
  marketingEmails: false,
};

export function NotificationsSettingsForm() {
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  });

  function onSubmit() {
    toast.success("Impostazioni notifiche aggiornate", {
      description:
        "Le tue preferenze di notifica sono state aggiornate con successo.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Notifiche</CardTitle>
          <CardDescription>
            Configura come e quando ricevere notifiche.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="transactionNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Notifiche Transazioni
                  </FormLabel>
                  <FormDescription>
                    Ricevi notifiche quando vengono effettuate nuove
                    transazioni.
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
            name="balanceAlerts"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Avvisi Saldo</FormLabel>
                  <FormDescription>
                    Ricevi avvisi quando il saldo scende sotto una soglia
                    definita.
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
                    Ricevi avvisi quando ti avvicini o superi il budget mensile.
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
            name="goalNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Notifiche Obiettivi
                  </FormLabel>
                  <FormDescription>
                    Ricevi notifiche sui progressi verso i tuoi obiettivi di
                    risparmio.
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
                    Email di Marketing
                  </FormLabel>
                  <FormDescription>
                    Ricevi email su nuove funzionalità e suggerimenti.
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
        <CardFooter className="flex justify-between">
          <Button variant="outline">Annulla</Button>
          <Button type="submit">Salva modifiche</Button>
        </CardFooter>
      </form>
    </Form>
  );
}
