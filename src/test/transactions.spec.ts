import { expect, it, beforeAll, afterAll, describe } from "vitest";
import request from "supertest";
import { app } from "../app";

describe("Transactions routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
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
});
