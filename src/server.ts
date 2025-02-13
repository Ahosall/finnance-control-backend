/// <reference path="./@types/fastify.d.ts" />
import "fastify";

import Fastify from "fastify";
import * as dotenv from "dotenv";

import jwtPlugin from "./plugins/jwt";

import transactionsRoutes from "./modules/transactions/transaction.routes";
import usersRoutes from "./modules/users/user.routes";

dotenv.config();

const app = Fastify();

app.register(async (instance) => {
  // Plugins
  await instance.register(jwtPlugin);
  
  // Routes
  await instance.register(transactionsRoutes);
  await instance.register(usersRoutes);
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
