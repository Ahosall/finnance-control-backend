import { z } from "zod";

export const TransactionSchema = z.object({
  date: z.coerce.date(),
  categoryId: z.string(),
  amount: z.number(),
  description: z.string(),
});

export type TransactionInput = z.infer<typeof TransactionSchema>;
