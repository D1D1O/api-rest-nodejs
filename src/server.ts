import fastify from "fastify";
//  import crypto from "node:crypto";
import { env } from "./env";
import { transactionsRoutes } from "./routes/transactions.routes";

const app = fastify();

app.register(transactionsRoutes, { prefix: "/transactions" });

app.listen({ port: env.PORT }).then(() => {
  console.log("😊 Server is running on port" || env.PORT.toString());
});
