import { z } from "zod";

export const transactionSchema = z.object({
  description: z.string().min(1, "La descrizione è obbligatoria"),
  amount: z.coerce.number(),
  date: z.string().min(1, "La data è obbligatoria"),
  sourceAccountId: z.string().min(1, "Il conto è obbligatorio"),
  destinationAccountId: z.string().optional(), // solo se trasferimento
  categoryId: z.string().optional(), // solo se non trasferimento
  transactionType: z.enum(["INCOME", "EXPENSE", "TRANSFER", "BUY", "SELL"]),
  userId: z.string().min(1, "L'ID utente è obbligatorio"),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Inserisci un'email valida" }),
  password: z.string().min(1, { message: "La password è obbligatoria" }),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
