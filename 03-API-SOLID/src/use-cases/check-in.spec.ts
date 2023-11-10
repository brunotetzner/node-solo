import { describe, expect, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;
describe("Check in Use case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Should be able to check in", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 12, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-1",
      userId: "user-1",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Should't be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 12, 0, 0));

    await sut.execute({
      gymId: "gym-1",
      userId: "user-1",
    });

    await expect(() =>
      sut.execute({ gymId: "gym-1", userId: "user-1" })
    ).rejects.toBeInstanceOf(Error);
  });

  it("Should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 12, 0, 0));

    await sut.execute({
      gymId: "gym-1",
      userId: "user-1",
    });
    vi.setSystemTime(new Date(2022, 0, 21, 12, 0, 0));

    const { checkIn } = await sut.execute({ gymId: "gym-1", userId: "user-1" });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
