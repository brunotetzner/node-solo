import request from "supertest";
import { app } from "@/app";
import { it, describe, beforeAll, afterAll, expect } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Nearby gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able list nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Javascript gym",
        description: null,
        phone: null,
        latitude: -22.3280133,
        longitude: -47.1799202,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "TYPEscript gym",
        description: null,
        phone: null,
        latitude: -27.3280133,
        longitude: -49.1799202,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({ latitude: -22.3280133, longitude: -47.1799202 })
      .set("Authorization", `Bearer ${token}`)
      .send();
    expect(response.statusCode).toBe(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: "Javascript gym" }),
    ]);
  });
});
