import { FastifyInstance } from "fastify";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/", async (_, reply) => {
    return reply.send({
      name: "Lenus Pharmacy API",
      message: "Use /api/products, /api/branches, /api/orders. Health: /health",
      links: { products: "/api/products", branches: "/api/branches", health: "/health" },
    });
  });
  app.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });
}
