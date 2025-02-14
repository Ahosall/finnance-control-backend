import * as http from "http";

interface IJWTUser {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  email: string;
}

declare module "fastify" {
  export interface FastifyInstance<
    HttpServer = http.Server,
    HttpRequest = http.IncomingMessage,
    HttpResponse = http.ServerResponse
  > {
    authenticate(request: FastifyRequest, reply: FastifyReply): void;
  }

  export interface FastifyRequest {
    user: IJWTUser;
  }
}
