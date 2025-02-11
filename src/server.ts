import Fastify from "fastify";
import * as dotenv from "dotenv";

import jwtPlugin from "./plugins/jwt";

dotenv.config();

const app = Fastify({
  logger: true,
});

app.register(jwtPlugin);

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
