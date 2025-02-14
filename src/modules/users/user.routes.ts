import { FastifyInstance } from "fastify";

import { createUser, getUser, loginUser } from "./user.service";
import { UserInput } from "./user.model";

interface ILoginData {
  email: string;
  password: string;
}

type TCreateUser = { Body: UserInput };
type TLoginUser = {
  Body: ILoginData;
};

export default async (instance: FastifyInstance) => {
  const preConf = { preHandler: [instance.authenticate] };

  // Create user
  instance.post<TCreateUser>("/", async (req, rep) => {
    try {
      await createUser(req.body);
      rep.status(201).send({ success: true });
    } catch (err: any) {
      rep.status(400).send({ error: err.message });
    }
  });

  // Login user
  instance.post<TLoginUser>("/login", async (req, rep) => {
    const { email, password } = req.body;

    try {
      const { token, user } = await loginUser(email, password, instance);
      rep.status(200).send({ token, user });
    } catch (err: any) {
      rep.status(401).send({ error: err.message });
    }
  });

  // Get user
  instance.get("/me", preConf, async (req, rep) => {
    try {
      const user = await getUser(req.user.sub);
      rep.status(200).send({ user });
    } catch (err: any) {
      rep.status(401).send({ error: err.message });
    }
  });
};
