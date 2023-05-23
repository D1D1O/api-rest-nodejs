// eslint-disable-next-line
import { knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    transactions: {
      id: string;
      title: string;
      amount: number;
      type: "credit" | "debet";
      created_at: string;
      sessionId?: string;
    };
  }
}
