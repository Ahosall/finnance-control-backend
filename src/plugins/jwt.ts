import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

async function jwtPlugin(instance: FastifyInstance) {
  instance.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "superblastermasterkey",
  });

  instance.decorate(
    "authenticate",
    async (req: FastifyRequest, rep: FastifyReply) => {
      try {
        await req.jwtVerify();
      } catch (error) {
        rep.status(401).send({ error: "Token inválido ou ausente" });
      }
    }
  );
}

export default fp(jwtPlugin, { name: "jwt-plugin" });
