import { FastifyInstance } from "fastify";
import crypto from "node:crypto";
import { knex } from "../database";
import { z } from "zod";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function transactionsRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request, reply) => {});

  app.get(
    "/",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const sessionId = request.cookies.session_id;
      const transactions = await knex("transactions")
        .select("*")
        .where("sessionId", sessionId);
      return { transactions };
    }
  );

  app.get(
    "/:id",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getTransactionParamsSchema = z.object({
        id: z.string().uuid(),
      });
      const { id } = getTransactionParamsSchema.parse(request.params);
      const sessionId = request.cookies.session_id;

      try {
        const transaction = await knex("transactions")
          .select("*")
          .where({
            sessionId,
            id,
          })
          .first();
        return { transaction };
      } catch (error) {
        return reply.status(404).send();
      }
    }
  );

  app.get(
    "/summary",
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const sessionId = request.cookies.session_id;
      const summary = await knex("transactions")
        .sum("amount", { as: "amount" })
        .where("sessionId", sessionId)
        .first();

      return { summary };
    }
  );

  app.post("/", async (request, reply) => {
    const createTransactionSchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debet"]),
    });

    const { title, amount, type } = createTransactionSchema.parse(request.body);

    let sessionIdNew = request.cookies.session_id;

    if (!sessionIdNew) {
      sessionIdNew = crypto.randomUUID();
      reply.cookie("session_id", sessionIdNew, {
        path: "/",
        maxAge: 60 * 60 * 24 * 24 * 7, // 7 days
      });
    }

    try {
      await knex("transactions").insert({
        id: crypto.randomUUID(),
        title,
        amount: type === "credit" ? amount : amount * -1,
        sessionId: sessionIdNew,
      });
      return reply.status(201).send();
    } catch (error) {
      return reply.status(404).send();
    }
  });
}
