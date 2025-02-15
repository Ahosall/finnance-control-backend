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
    where: onlyForDashboard ? { userId, showOnDashboard: true } : { userId },
    select: {
      id: true,
      name: true,
      type: true,
      createdAt: true,
      showOnDashboard: true,
      transactions: onlyForDashboard ? { select: { amount: true } } : false,
    },
  });

  return categories.map((category) => {
    return category.transactions
      ? {
          id: category.id,
          name: category.name,
          type: category.type,
          total: category.transactions.reduce((a, t) => a + t.amount, 0),
          createdAt: category.createdAt,
        }
      : category;
  });
};

export const getCategoryById = async (categoryId: string, userId: string) => {
  return await prisma.category.findUnique({
    where: {
      id: categoryId,
      userId,
    },
  });
};

export const updateCategory = async (
  categoryId: string,
  data: CategoryInput
) => {
  const validatedData = CategorySchema.parse(data);

  const category = await prisma.category.update({
    data: {
      name: validatedData.name,
      showOnDashboard: data.showOnDashboard,
      type: validatedData.type,
    },
    where: {
      id: categoryId,
    },
  });

  return category;
};
