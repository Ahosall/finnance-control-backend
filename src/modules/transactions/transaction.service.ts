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
  const previousTransactions = await prisma.transaction.findMany({
    where: { userId, date: { lt: start } },
    select: { amount: true, category: { select: { type: true } } },
  });

  const transactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: start, lte: end } },
    orderBy: { date: "asc" },
    select: {
      id: true,
      amount: true,
      description: true,
      date: true,
      category: { select: { id: true, type: true } },
    },
  });

  let currentBalance = previousTransactions.reduce((amount, transaction) => {
    return transaction.category.type === "INCOME"
      ? amount + transaction.amount
      : amount - transaction.amount;
  }, 0);

  const transactionsWithBalance = transactions.map((t) => {
    currentBalance += t.category.type === "INCOME" ? t.amount : -t.amount;
    return { ...t, balance: currentBalance };
  });

  return transactionsWithBalance;
};
