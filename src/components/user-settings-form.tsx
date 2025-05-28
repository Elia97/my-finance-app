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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

const userFormSchema = z.object({
  name: z.string().min(2, {
    message: "Il nome deve contenere almeno 2 caratteri.",
  }),
  email: z.string().email({
    message: "Inserisci un indirizzo email valido.",
  }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export function UserSettingsForm({
  user,
  onUpdate,
}: {
  user: UserFormValues;
  onUpdate?: (updatedFields: UserFormValues) => void;
}) {
  const defaultValues: Partial<UserFormValues> = {
    name: user.name,
    email: user.email,
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      const response = await fetch("api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Errore durante l'aggiornamento dell'account");
      }

      toast.success("Account aggiornato con successo!");
      onUpdate?.(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Si è verificato un errore sconosciuto."
      );
    }
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Gestisci le tue informazioni personali e le impostazioni
              dell&apos;account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Questo è il nome che verrà visualizzato nel tuo profilo.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Questo indirizzo email verrà utilizzato per le notifiche.
                  </FormDescription>
                  <FormMessage />
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
