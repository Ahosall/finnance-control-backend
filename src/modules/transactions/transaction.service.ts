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

  // Implementar logica para ajustar saldo

  const transaction = await prisma.transaction.create({
    data: {
      userId: category.userId,
      categoryId: category.id,
      amount: validatedData.amount,
      description: validatedData.description,
      date: validatedData.date,
    },
  });

  return transaction;
};

export const listTransactions = async (
  start: Date,
  end: Date,
  userId: string
) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: start, lte: end } },
    orderBy: { date: "asc" },
    include: {
      category: true,
    },
  });

  return transactions;
};
