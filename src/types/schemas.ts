import { z } from "zod";

export const transactionSchema = z.object({
  description: z.string().min(1, "La descrizione è obbligatoria"),
  amount: z.coerce.number(),
  date: z.string().min(1, "La data è obbligatoria"),
  sourceAccountId: z.string().min(1, "Il conto è obbligatorio"),
  destinationAccountId: z.string().optional(), // solo se trasferimento
  categoryId: z.string().optional(), // solo se non trasferimento
  transactionType: z.enum(["INCOME", "EXPENSE", "TRANSFER", "BUY", "SELL"]),
});

export const investmentTransactionSchema = z.object({
  quantity: z.coerce.number(),
  purchasePrice: z.coerce.number(),
  date: z.string().min(1, "La data è obbligatoria"),
  investmentId: z.string().min(1, "L'ID investimento è obbligatorio"),
  transactionType: z.enum(["BUY", "SELL"]),
});

export const accountSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  balance: z.coerce.number().optional(),
  type: z.enum(["CHECKING", "INVESTMENT"]),
  currency: z.string().optional(),
  number: z.string().optional(),
});

export const investmentSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  type: z.enum(["STOCK", "BOND", "ETF", "CRYPTO"]),
  quantity: z.coerce.number(),
  purchasePrice: z.coerce.number(),
  currentPrice: z.coerce.number(),
  accountId: z.string().min(1, "L'ID conto è obbligatorio"),
  currency: z.string().optional(),
  startDate: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Inserisci un'email valida" }),
  password: z.string().min(1, { message: "La password è obbligatoria" }),
});

export const updatePriceSchema = z.object({
  price: z.coerce.number(),
  investmentId: z.string().min(1, "L'ID investimento è obbligatorio"),
});

export const preferencesSchema = z.object({
  balanceAlerts: z.boolean(),
  budgetAlerts: z.boolean(),
  marketingEmails: z.boolean(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
export type InvestmentTransactionFormData = z.infer<
  typeof investmentTransactionSchema
>;
export type AccountFormData = z.infer<typeof accountSchema>;
export type InvestmentFormData = z.infer<typeof investmentSchema>;
export type UpdatePriceFormData = z.infer<typeof updatePriceSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type PreferencesFormValues = z.infer<typeof preferencesSchema>;
