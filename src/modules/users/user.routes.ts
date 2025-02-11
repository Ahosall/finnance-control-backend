import { FastifyInstance } from "fastify";
import { UserInput } from "./user.model";
import { createUser, loginUser } from "./user.service";

export default async (instance: FastifyInstance) => {
  // Create user
  instance.post<{
    Body: UserInput;
  }>("/users", async (req, rep) => {
    try {
      await createUser(req.body);
      rep.status(201).send({ success: true });
    } catch (err: any) {
      rep.status(400).send({ error: err.message });
    }
  });

  // Login user
  instance.post<{
    Body: {
      email: string;
      password: string;
    };
  }>("/login", async (req, rep) => {
    const { email, password } = req.body;

    try {
      const { token } = await loginUser(email, password, instance);
      rep.status(200).send(token);
    } catch (err: any) {
      rep.status(401).send({ error: err.message });
    }
  });
};
