import { FastifyInstance } from "fastify";
import { CategoryInput } from "./category.model";
import { createCategory, listCategories } from "./category.service";

interface IListCategoriesFilters {
  onlyForDashboard?: string;
}

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
  instance.get<{ Querystring: IListCategoriesFilters }>(
    "/",
    preConf,
    async (req, rep) => {
      const { onlyForDashboard } = req.query;
      const userId = req.user.sub;
      const isForDashboard = onlyForDashboard === "true";
      try {
        const categories = await listCategories(userId, isForDashboard);
        rep.status(200).send({ categories });
      } catch (err: any) {
        rep.status(500).send({ error: err.message });
      }
    }
  );
};
