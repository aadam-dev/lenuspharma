import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import jwt from "@fastify/jwt";
import { healthRoutes } from "./routes/health";
import { productRoutes } from "./routes/products";
import { orderRoutes } from "./routes/orders";
import { branchRoutes } from "./routes/branches";
import { paymentRoutes } from "./routes/payments";
import { adminRoutes } from "./routes/admin";
import { redactString, redactUnknown } from "./lib/redact";

const app = Fastify({
  logger: {
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: redactString(req.url as string),
          host: req.headers.host,
          remoteAddress: req.socket?.remoteAddress,
        };
      },
    },
  },
});

async function main() {
  const jwtSecret = process.env.JWT_SECRET;
  if (process.env.NODE_ENV === "production" && !jwtSecret) {
    throw new Error("JWT_SECRET is required in production");
  }

  await app.register(jwt, {
    secret: jwtSecret ?? "dev-only-change-me",
  });

  await app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? true,
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  app.setErrorHandler((err, _request, reply) => {
    const status = (err as { statusCode?: number }).statusCode ?? 500;
    app.log.error(redactString(err.message));
    reply.status(status).send({
      error: redactString(status === 500 ? "Internal Server Error" : err.message),
    });
  });

  await app.register(healthRoutes);
  await app.register(productRoutes, { prefix: "/api" });
  await app.register(orderRoutes, { prefix: "/api" });
  await app.register(branchRoutes, { prefix: "/api" });
  await app.register(paymentRoutes, { prefix: "/api" });
  await app.register(adminRoutes, { prefix: "/api/admin" });

  const port = Number(process.env.PORT) || 4000;
  await app.listen({ port, host: "0.0.0.0" });
  console.log(`API listening on http://localhost:${port}`);
}

main().catch((err) => {
  console.error(redactUnknown(err));
  process.exit(1);
});
