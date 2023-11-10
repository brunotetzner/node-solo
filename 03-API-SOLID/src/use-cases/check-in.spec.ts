import { describe, expect, it, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { Decimal } from "@prisma/client/runtime/library";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check in Use case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gymsRepository.items.push({
      id: "gym-1",
      title: "javascript gym",
      description: "javascript gym",
      phone: "123456789",
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    });
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
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Should't be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 12, 0, 0));

    await sut.execute({
      gymId: "gym-1",
      userId: "user-1",
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-1",
        userId: "user-1",
        userLatitude: 0,
        userLongitude: 0,
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("Should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 12, 0, 0));

    await sut.execute({
      gymId: "gym-1",
      userId: "user-1",
      userLatitude: 0,
      userLongitude: 0,
    });
    vi.setSystemTime(new Date(2022, 0, 21, 12, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-1",
      userId: "user-1",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("Should not be able to check in on a distant gym", async () => {
    gymsRepository.items.push({
      id: "gym-2",
      title: "javascript gym",
      description: "javascript gym",
      phone: "123456789",
      latitude: new Decimal(-22.3280133),
      longitude: new Decimal(-47.1799202),
    });
    await expect(() =>
      sut.execute({
        gymId: "gym-2",
        userId: "user-1",
        userLatitude: -22.3439955,
        userLongitude: -47.154902,
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
