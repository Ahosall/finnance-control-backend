import { FastifyInstance } from "fastify";

import {
  createTransaction,
  getTransactionById,
  listTransactions,
  updateTransaction,
} from "./transaction.service";
import { TransactionInput } from "./transaction.model";

interface IListTransactionsPeriod {
  start: string;
  end: string;
}

interface IGetTransaction {
  id: string;
}

type TCreateTransaction = { Body: TransactionInput };
type TListTransactions = { Querystring: IListTransactionsPeriod };
type TGetTransaction = { Params: IGetTransaction };
type TPutTransaction = TGetTransaction & TCreateTransaction;

export default async (instance: FastifyInstance) => {
  const preConf = { preHandler: [instance.authenticate] };

  // Create transaction
  instance.post<TCreateTransaction>("/", preConf, async (req, rep) => {
    try {
      const transaction = await createTransaction(req.body);
      rep.status(201).send({ transaction });
    } catch (err: any) {
      rep.status(400).send({ error: err.message });
    }
  });

  // List transactions by period
  instance.get<TListTransactions>("/", preConf, async (req, rep) => {
    let { start, end } = req.query;
    try {
      if (!start || !end) {
        throw new Error(
          "Missing queries! Choose a period between one another."
        );
      }

      const transactions = await listTransactions(
        req.user.sub,
        new Date(start + "T12:00:00.000Z"),
        new Date(end + "T12:00:00.000Z")
      );
      rep.status(200).send({ transactions });
    } catch (err: any) {
      rep.status(500).send({ error: err.message });
    }
  });

  // Get transaction by id
  instance.get<TGetTransaction>("/:id", preConf, async (req, rep) => {
    try {
      const transaction = await getTransactionById(req.params.id, req.user.sub);
      if (!transaction) {
        return rep.status(404).send({ message: "Transaction not found" });
      }

      rep.status(200).send({ transaction });
    } catch (err: any) {
      rep.status(500).send({ error: err.message });
    }
  });

  // Update transaction
  instance.put<TPutTransaction>("/:id", preConf, async (req, rep) => {
    try {
      const exists = await getTransactionById(req.params.id, req.user.sub);
      if (!exists) {
        return rep.status(404).send({ message: "Transaction not found" });
      }
      const transaction = await updateTransaction(req.params.id, {
        ...exists,
        ...req.body,
      });
      rep.status(200).send({ transaction });
    } catch (err: any) {
      rep.status(400).send({ error: err.message });
    }
  });
};
