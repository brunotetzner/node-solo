import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gym-repository";
import { FetchNearByGymUseCase } from "../fetch-near-by-gyms";

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository();

  const useCase = new FetchNearByGymUseCase(gymsRepository);

  return useCase;
}
