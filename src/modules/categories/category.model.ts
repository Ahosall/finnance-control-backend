import { z } from "zod";

export const CategorySchema = z.object({
  name: z
    .string()
    .min(5, "O nome da categoria deve ter pelo menos 5 caracteres"),
  type: z.string(),
  showOnDashboard: z.boolean().default(false),
});

export type CategoryInput = z.infer<typeof CategorySchema>;
