import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { beforeEach, expect, describe, it } from "vitest";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Register Gym Use case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymsRepository);
  });
  it("Should be able to register", async () => {
    const { gym } = await sut.execute({
      title: "Javascript gym",
      description: null,
      phone: null,
      latitude: -22.3280133,
      longitude: -47.1799202,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
