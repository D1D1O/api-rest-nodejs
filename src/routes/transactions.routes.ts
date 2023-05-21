import { FastifyInstance } from "fastify";
import crypto from "node:crypto";
import { knex } from "../database";
import { z } from "zod";

export async function transactionsRoutes(app: FastifyInstance) {
  app.get("/hello", async () => {
    const transactions = await knex("transactions").select("*");
    return transactions;
  });

  app.post("/", async (request, reply) => {
    const createTransactionSchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debet"]),
    });

    const { title, amount, type } = createTransactionSchema.parse(request.body);

    try {
      await knex("transactions").insert({
        id: crypto.randomUUID(),
        title,
        amount: type === "credit" ? amount : amount * -1,
      });
      return reply.status(201).send();
    } catch (error) {
      return reply.status(404).send();
    }
  });
}
