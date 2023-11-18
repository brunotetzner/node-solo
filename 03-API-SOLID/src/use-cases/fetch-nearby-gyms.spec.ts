import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearByGymUseCase } from "./fetch-near-by-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearByGymUseCase;

describe("Fetch nearby Gyms Use case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearByGymUseCase(gymsRepository);
  });

  it("Should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      latitude: -22.3280133,
      longitude: -47.1799202,
    });
    await gymsRepository.create({
      title: "Far Gym",
      description: null,
      phone: null,
      latitude: -27.3280133,
      longitude: -49.1799202,
    });
    const { gyms } = await sut.execute({
      userLatitude: -22.3439955,
      userLongitude: -47.154902,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
