import { FastifyInstance } from "fastify";
import { CategoryInput } from "./category.model";
import { createCategory, listCategories } from "./category.service";

export default async (instance: FastifyInstance) => {
  const preConf = { preHandler: [instance.authenticate] };

  // Create
  instance.post<{ Body: CategoryInput }>("/", preConf, async (req, rep) => {
    try {
      await createCategory(req.body, req.user.sub);
      rep.status(201).send({ success: true });
    } catch (err: any) {
      rep.status(400).send({ error: err.message });
    }
  });

  // List
  instance.get("/", preConf, async (req, rep) => {
    try {
      const categories = await listCategories(req.user.sub);
      rep.status(200).send({ categories });
    } catch (err: any) {
      rep.status(500).send({ error: err.message });
    }
  });
};
