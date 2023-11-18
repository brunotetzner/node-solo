import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "./search-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Search Gyms Use case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("Should be able to search for gyms", async () => {
    await gymsRepository.create({
      title: "Javascript Gym",
      description: null,
      phone: null,
      latitude: -22.3280133,
      longitude: -47.1799202,
    });
    await gymsRepository.create({
      title: "Typescript Gym",
      description: null,
      phone: null,
      latitude: -22.3280133,
      longitude: -47.1799202,
    });
    const { gyms } = await sut.execute({
      query: "Javascript",
      page: 1,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Javascript Gym" }),
    ]);
  });

  it("Should be able to fetch paginated for gyms search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Gym ${i}`,
        description: null,
        phone: null,
        latitude: -22.3280133,
        longitude: -47.1799202,
      });
    }

    const { gyms } = await sut.execute({
      query: "Gym",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Gym 21" }),
      expect.objectContaining({ title: "Gym 22" }),
    ]);
  });
});
