import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gym-repository";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-checkin-repository";
import { CheckInUseCase } from "../check-in";

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const gymsRepository = new PrismaGymsRepository();

  const useCase = new CheckInUseCase(checkInsRepository, gymsRepository);

  return useCase;
}
