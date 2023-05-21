import { knex as setupKnex, Knex } from "knex";
import { env } from "./env";

console.log(env.DATABASE_URL);
export const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: "./db/app.db",
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations",
  },
};

export const knex = setupKnex(config);
