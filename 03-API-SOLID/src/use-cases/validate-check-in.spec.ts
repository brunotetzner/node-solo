import { describe, expect, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe("Validate Check in Use case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("Should be able to validate the check in", async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-1",
      user_id: "user-1",
    });
    const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
  });
  it("Should not be able to validate the check in", async () => {
    expect(() =>
      sut.execute({ checkInId: "inexistent-checkIn-id" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
  it("Should not be albe to validate the check in after 20 minutes it`s created", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 12, 0, 0));

    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gym-1",
      user_id: "user-1",
    });

    const twentyOneMinutesInMilliseconds = 21 * 60 * 1000;
    vi.advanceTimersByTime(twentyOneMinutesInMilliseconds);

    await expect(() =>
      sut.execute({ checkInId: createdCheckIn.id })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
