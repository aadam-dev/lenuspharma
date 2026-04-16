import { FastifyInstance } from "fastify";
import { createOrder } from "../services/orderService";

export async function orderRoutes(app: FastifyInstance) {
  app.post("/orders", async (request, reply) => {
    const result = await createOrder(request.body);
    if (!result.success) {
      if (typeof result.error === "object" && "fieldErrors" in result.error) {
        return reply.status(400).send({ error: "Validation failed", details: result.error });
      }
      return reply.status(400).send({ error: result.error });
    }
    return reply.status(201).send(result.order);
  });
}
