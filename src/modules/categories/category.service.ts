import { PrismaClient } from "@prisma/client";
import { CategoryInput, CategorySchema } from "./category.model";

const prisma = new PrismaClient();

export const createCategory = async (data: CategoryInput, userId: string) => {
  const validatedData = CategorySchema.parse(data);

  const category = await prisma.category.create({
    data: {
      name: validatedData.name,
      type: validatedData.type,
      userId: userId,
    },
  });

  return category;
};

export const listCategories = async (
  userId: string,
  onlyForDashboard?: boolean
) => {
  const categories = await prisma.category.findMany({
    where: onlyForDashboard
      ? {
          userId,
          showOnDashboard: true,
        }
      : { userId },
    include: {
      transactions: onlyForDashboard,
    },
  });

  return categories.map((category) => {
    return category.transactions
      ? {
          ...category,
          total: category.transactions.reduce((a, t) => a + t.amount, 0),
        }
      : category;
  });
};
