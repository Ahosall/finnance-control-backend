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
  userId: string,
  start: Date,
  end: Date
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
      category: { select: { id: true, name: true, type: true } },
    },
  });

  let currentBalance = previousTransactions.reduce((amount, transaction) => {
    return transaction.category.type === "INCOME"
      ? amount + transaction.amount
      : amount - transaction.amount;
  }, 0);

  const transactionsWithBalance = transactions.map((t) => {
    currentBalance += t.category.type === "INCOME" ? t.amount : -t.amount;
    return { ...t, balance: parseFloat(currentBalance.toFixed(2)) };
  });

  return transactionsWithBalance.reverse();
};

export const getTransactionById = async (
  transactionId: string,
  userId: string
) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId, userId },
  });
  return transaction;
};

export const updateTransaction = async (
  transactionId: string,
  data: TransactionInput
) => {
  const validatedData = TransactionSchema.parse(data);

  const transaction = await prisma.transaction.update({
    data: {
      categoryId: validatedData.categoryId,
      amount: validatedData.amount,
      description: validatedData.description,
      date: validatedData.date,
    },
    where: {
      id: transactionId,
    },
  });

  return transaction;
};

export const deleteTransaction = async (transactionId: string) => {
  const result = await prisma.transaction.delete({
    where: {
      id: transactionId,
    },
  });

  return result;
};
