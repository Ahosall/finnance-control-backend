import { PrismaClient } from "@prisma/client";
import { compareSync, hashSync } from "bcrypt-ts";
import { UserInput, UserSchema } from "./user.model";
import { FastifyInstance } from "fastify";

const prisma = new PrismaClient();

export const createUser = async (data: UserInput) => {
  const validatedData = UserSchema.parse(data);

  const existingUser = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });

  if (existingUser) {
    throw new Error("Este e-mail já está em uso.");
  }

  const hashedPassword = await hashSync(validatedData.password, 12);

  const user = await prisma.user.create({
    data: {
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
    },
  });

  return user;
};

export const loginUser = async (
  email: string,
  password: string,
  instance: FastifyInstance
) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await compareSync(password, user.password))) {
    throw new Error("E-mail ou senha incorretos");
  }

  const jwtPayload = {
    iss: process.env.JWT_ISS,
    aud: "web-client",
    exp: Date.now() + 21_600_000,
    iat: Date.now(),
    sub: user.id,
    email: user.email,
  };

  const token = instance.jwt.sign(jwtPayload);
  return { token };
};
