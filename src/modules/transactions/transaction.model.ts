import { z } from "zod";

export const TransactionSchema = z.object({
  date: z.date(),
  type: z.string(),
  categoryId: z.string(),
  amount: z.number(),
  description: z.string(),
});

export type TransactionInput = z.infer<typeof TransactionSchema>;
