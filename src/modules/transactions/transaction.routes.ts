import { FastifyInstance } from "fastify";
import { TransactionInput } from "./transaction.model";
import { createTransaction, listTransactions } from "./transaction.service";

interface IListTransactionsPeriod {
  start: string;
  end: string;
}

export default async (instance: FastifyInstance) => {
  const preConf = { preHandler: [instance.authenticate] };

  // Create transaction
  instance.post<{ Body: TransactionInput }>("/", preConf, async (req, rep) => {
    try {
      await createTransaction(req.body);
      rep.status(201).send({ success: true });
    } catch (err: any) {
      rep.status(400).send({ error: err.message });
    }
  });

  // List transactions by period
  instance.get<{ Querystring: IListTransactionsPeriod }>(
    "/",
    preConf,
    async (req, rep) => {
      const { start, end } = req.query;
      try {
        const transactions = await listTransactions(
          new Date(start),
          new Date(end),
          req.user.sub
        );
        rep.status(200).send({ transactions });
      } catch (err: any) {
        rep.status(500).send({ error: err.message });
      }
    }
  );
};
