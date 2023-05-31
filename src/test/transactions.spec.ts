import { expect, it, beforeAll, afterAll, describe, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../app";
import { execSync } from "child_process";

describe("Transactions routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  beforeEach(() => {
    execSync("npx knex migrate:rollback --all");
    execSync("npx knex migrate:latest");
  });

  it("user can create a new transaction", async () => {
    await request(app.server)
      .post("/transactions")
      .send({
        title: "Salário",
        amount: 1000,
        type: "credit",
      })
      .expect(201);
  });

  it("should be able to list all transactions", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "Salário",
        amount: 1000,
        type: "credit",
      });
    const coockies = createTransactionResponse.get("Set-Cookie");

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", coockies)
      .expect(200);

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: "Salário",
        amount: 1000,
      }),
    ]);
  });

  it("should be able to get specific transaction", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "Salário",
        amount: 1000,
        type: "credit",
      });
    const coockies = createTransactionResponse.get("Set-Cookie");

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", coockies)
      .expect(200);

    const transactionId = listTransactionsResponse.body.transactions[0].id;
    const getTransactionsResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set("Cookie", coockies)
      .expect(200);

    expect(getTransactionsResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: "Salário",
        amount: 1000,
      })
    );
  });

  it("should be able to get the summary", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "Credito",
        amount: 5000,
        type: "credit",
      });
    const cookies = createTransactionResponse.get("Set-Cookie");

    await request(app.server)
      .post("/transactions")
      .set("Cookie", cookies)
      .send({
        title: "Debito",
        amount: 2000,
        type: "debet",
      });

    const summaryResponse = await request(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookies)
      .expect(200);

    expect(summaryResponse.body.summary).toEqual({
      amount: 3000,
    });
  });
});
