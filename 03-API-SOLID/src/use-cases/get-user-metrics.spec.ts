import { describe, expect, it, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("Get user metrics Use case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it("Should be able to get check-ins count from metrics", async () => {
    await checkInsRepository.create({
      gym_id: "gym-1",
      user_id: "user-1",
    });
    await checkInsRepository.create({
      gym_id: "gym-2",
      user_id: "user-1",
    });
    const { checkInsCount } = await sut.execute({
      userId: "user-1",
    });

    expect(checkInsCount).toEqual(2);
  });
});
