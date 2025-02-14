import fp from "fastify-plugin";
import fastifyCors from "@fastify/cors";
import { FastifyInstance } from "fastify";

async function corsPlugin(instance: FastifyInstance) {
  instance.register(fastifyCors, { origin: true, credentials: true });
}

export default fp(corsPlugin, { name: "cors-plugin" });
