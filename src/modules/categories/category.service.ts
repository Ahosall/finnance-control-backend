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

export const listCategories = async (userId: string) => {
  const categories = await prisma.category.findMany({
    where: {
      userId,
    },
  });

  return categories;
};
