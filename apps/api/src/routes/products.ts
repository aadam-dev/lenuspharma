import { FastifyInstance } from "fastify";
import { prisma } from "../db";

export async function productRoutes(app: FastifyInstance) {
  app.get("/products", async (request, reply) => {
    const query = request.query as { category?: string; type?: string };
    const products = await prisma.product.findMany({
      where: {
        ...(query.category && { category: query.category }),
        ...(query.type && { type: query.type }),
      },
      orderBy: { name: "asc" },
    });
    return reply.send(
      products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: Number(p.price),
        category: p.category,
        type: p.type,
        imageUrl: p.imageUrl,
        stock: p.stock,
        branchId: p.branchId,
        createdAt: p.createdAt,
      }))
    );
  });

  app.get<{ Params: { id: string } }>("/products/:id", async (request, reply) => {
    const { id } = request.params;
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      return reply.status(404).send({ error: "Product not found" });
    }
    return reply.send({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      category: product.category,
      type: product.type,
      imageUrl: product.imageUrl,
      stock: product.stock,
      branchId: product.branchId,
      createdAt: product.createdAt,
    });
  });
}
