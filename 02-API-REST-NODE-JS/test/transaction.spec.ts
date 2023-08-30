import {
  afterAll,
  beforeAll,
  test,
  describe,
  expect,
  beforeEach,
} from "vitest";
import { execSync } from "node:child_process";
import { app } from "../src/app";
import request from "supertest";

describe("Transaction routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  test("Should be able to create a new transaction", async () => {
    await request(app.server)
      .post("/transactions")
      .send({ title: "New transaction", amount: 5000, type: "credit" })
      .expect(201);
  });

  test("Should be able to list all transactions", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({ title: "New transaction", amount: 5000, type: "credit" });

    const cookies = createTransactionResponse.get("Set-Cookie");

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: "New transaction",
        amount: 5000,
      }),
    ]);
  });

  test("Should be able to get a specific transaction", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({ title: "New transaction", amount: 5000, type: "credit" });

    const cookies = createTransactionResponse.get("Set-Cookie");
    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies);

    const transactionid = listTransactionsResponse.body.transactions[0].id;

    const geTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionid}`)
      .set("Cookie", cookies);

    expect(geTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: "New transaction",
        amount: 5000,
      })
    );
  });

  test("Should be able to get the summary", async () => {
    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({ title: "New transaction", amount: 5000, type: "credit" });

    const cookies = createTransactionResponse.get("Set-Cookie");

    await request(app.server)
      .post("/transactions")
      .set("Cookie", cookies)
      .send({ title: "debit transaction", amount: 2000, type: "debit" });

    const summaryResponse = await request(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookies)
      .send({ title: "debit transaction", amount: 2000, type: "debit" });

    expect(summaryResponse.body.summary).toEqual({ amount: 3000 });
  });
});
