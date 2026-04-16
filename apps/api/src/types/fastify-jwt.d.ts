import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      role: string;
      email: string;
      name: string;
    };
    user: {
      sub: string;
      role: string;
      email: string;
      name: string;
    };
  }
}
