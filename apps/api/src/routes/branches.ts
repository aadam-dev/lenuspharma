import { FastifyInstance } from "fastify";
import { prisma } from "../db";

export async function branchRoutes(app: FastifyInstance) {
  app.get("/branches", async (_, reply) => {
    const branches = await prisma.branch.findMany({
      orderBy: { name: "asc" },
    });
    return reply.send(
      branches.map((b) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        address: b.address,
        phone: b.phone,
        ghanaPostGps: b.ghanaPostGps,
        lat: b.lat,
        lng: b.lng,
        createdAt: b.createdAt,
      }))
    );
  });
}
