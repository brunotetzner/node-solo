import request from "supertest";
import { app } from "@/app";
import { it, describe, beforeAll, afterAll, expect } from "vitest";

describe("Register (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("shoult be able to register", async () => {
    const response = await request(app.server).post("/users").send({
      name: "John Doe",
      email: "jondoe@example.com",
      password: "123456",
    });

    expect(response.statusCode).toBe(201);
  });
});
