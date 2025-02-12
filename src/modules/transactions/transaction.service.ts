import { PrismaClient } from "@prisma/client";
import { TransactionInput, TransactionSchema } from "./transaction.model";

const prisma = new PrismaClient();

export const createTransaction = async (data: TransactionInput) => {
  const validatedData = TransactionSchema.parse(data);

  const category = await prisma.category.findUnique({
    where: { id: validatedData.categoryId },
  });

  if (!category) {
    throw new Error("A categoria selecionada não existe");
  }

  const transaction = await prisma.transaction.create({
    data: {
      amount: validatedData.amount,
      categoryId: category.id,
      userId: category.userId,
    },
  });

  return transaction;
};
