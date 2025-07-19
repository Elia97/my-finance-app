"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormData } from "@/types/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function LoginPage() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormData) => {
    try {
      const res = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (res?.error) {
        if (res.error === "CredentialsSignin") {
          form.setError("root", {
            message: "Email o password non validi",
          });
        } else {
          form.setError("root", {
            message: "Errore durante l'accesso. Riprova.",
          });
        }
        return;
      }

      if (res?.ok) {
        // Reindirizza alla homepage
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Login error:", error);
      form.setError("root", {
        message: "Errore di rete. Controlla la connessione.",
      });
    }
  };

  return (
    <main className="flex items-center justify-center h-screen bg-background">
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            Accedi con le tue credenziali
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Accedi
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
