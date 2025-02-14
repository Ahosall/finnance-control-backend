/// <reference path="./@types/fastify.d.ts" />
import "fastify";

import Fastify from "fastify";
import * as dotenv from "dotenv";

import jwtPlugin from "./plugins/jwt";

import usersRoutes from "./modules/users/user.routes";
import categoriesRoutes from "./modules/categories/category.routes";
import transactionsRoutes from "./modules/transactions/transaction.routes";

dotenv.config();

const app = Fastify();

app.register(async (instance) => {
  // Plugins
  await instance.register(jwtPlugin);

  // Routes
  await instance.register(usersRoutes, { prefix: "/users" });
  await instance.register(categoriesRoutes, { prefix: "/categories" });
  await instance.register(transactionsRoutes, { prefix: "/transactions" });
});

const start = async () => {
  const { PORT } = process.env;
  const appConf = {
    port: PORT ? parseInt(PORT) : 3000,
  };

  try {
    await app.listen(appConf);
    console.log("Servidor rodando em http://localhost:3000");
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
