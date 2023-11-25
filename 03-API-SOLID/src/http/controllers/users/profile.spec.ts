import request from "supertest";
import { app } from "@/app";
import { it, describe, beforeAll, afterAll, expect } from "vitest";
import exp from "constants";

describe("Profile (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get user profile", async () => {
    await request(app.server).post("/users").send({
      name: "John Doe",
      email: "jondoe@example.com",
      password: "123456",
    });
    const AuthResponse = await request(app.server).post("/sessions").send({
      email: "jondoe@example.com",
      password: "123456",
    });
    const { token } = AuthResponse.body;

    const response = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ email: "jondoe@example.com" })
    );
  });
});
