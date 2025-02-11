import { FastifyInstance } from "fastify";
import { TransactionInput } from "./transaction.model";
import { createTransaction } from "./transaction.service";

export default async (instance: FastifyInstance) => {
  // Create transaction
  instance.post<{
    Body: TransactionInput;
  }>(
    "/transactions",
    { preHandler: [instance.authenticate] },
    async (req, rep) => {
      try {
        await createTransaction(req.body);
        rep.status(201).send({ success: true });
      } catch (err: any) {
        rep.status(400).send({ error: err.message });
      }
    }
  );
};
