import { FastifyInstance } from "fastify";
import { CategoryInput } from "./category.model";
import {
  createCategory,
  getCategoryById,
  listCategories,
  updateCategory,
} from "./category.service";

interface IGetCategory {
  id: string;
}
interface IFilterCategories {
  onlyForDashboard?: string;
}

type TCreateCategory = { Body: CategoryInput };
type TListCategories = { Querystring: IFilterCategories };
type TGetCategory = { Params: IGetCategory };
type TPutCategory = TGetCategory & TCreateCategory;

export default async (instance: FastifyInstance) => {
  const preConf = { preHandler: [instance.authenticate] };

  // Create
  instance.post<TCreateCategory>("/", preConf, async (req, rep) => {
    try {
      await createCategory(req.body, req.user.sub);
      rep.status(201).send({ success: true });
    } catch (err: any) {
      rep.status(400).send({ error: err.message });
    }
  });

  // List
  instance.get<TListCategories>("/", preConf, async (req, rep) => {
    const { onlyForDashboard } = req.query;
    const userId = req.user.sub;
    const isForDashboard = onlyForDashboard === "true";
    try {
      const categories = await listCategories(userId, isForDashboard);
      rep.status(200).send({ categories });
    } catch (err: any) {
      rep.status(500).send({ error: err.message });
    }
  });

  // Get
  instance.get<TGetCategory>("/:id", preConf, async (req, rep) => {
    try {
      const category = await getCategoryById(req.params.id, req.user.sub);
      if (!category) {
        return rep.status(404).send({ message: "Category not found" });
      }

      rep.status(200).send({ category });
    } catch (err: any) {
      rep.status(500).send({ error: err.message });
    }
  });

  // Update
  instance.put<TPutCategory>("/:id", preConf, async (req, rep) => {
    try {
      const exists = await getCategoryById(req.params.id, req.user.sub);
      if (!exists) {
        return rep.status(404).send({ message: "Category not found" });
      }

      const category = await updateCategory(req.params.id, {
        ...exists,
        ...req.body,
      });
      rep.status(200).send({ category });
    } catch (err: any) {
      rep.status(500).send({ error: err.message });
    }
  });
};
