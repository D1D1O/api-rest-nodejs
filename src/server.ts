import fastify from "fastify";
//  import crypto from "node:crypto";
import { knex } from "./database";
import { env } from "./env";

const app = fastify();

app.get("/hello", async () => {
  // const teste = await knex("sqlite_schema").select("*");
  // return teste;

  // const transactions = await knex("transactions")
  //   .insert({
  //     id: crypto.randomUUID(),
  //     title: "Transaction 3",
  //     amount: 100,
  //   })
  //   .returning("*");

  const transactions = await knex("transactions").select("*");
  return transactions;
});

app.listen({ port: env.PORT }).then(() => {
  console.log("😊 Server is running on port" || env.PORT.toString());
});
