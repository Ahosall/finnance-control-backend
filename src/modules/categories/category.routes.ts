import { FastifyInstance } from "fastify";
import { CategoryInput } from "./category.model";
import { createCategory } from "./category.service";

export default async (instance: FastifyInstance) => {
  instance.post<{
    Body: CategoryInput;
  }>(
    "/transactions",
    { preHandler: [instance.authenticate] },
    async (req, rep) => {
      try {
        console.log(req.user)
        // await createCategory(req.body, req.user.);
        rep.status(201).send({ success: true });
      } catch (err: any) {
        rep.status(400).send({ error: err.message });
      }
    }
  );
};
