import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeFetchNearbyGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-use-case";

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((n) => {
      return Math.abs(n) <= 90;
    }),
    longitude: z.coerce.number().refine((n) => {
      return Math.abs(n) <= 180;
    }),
  });

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query);

  const fetchNearbyGymsQuerySchema = makeFetchNearbyGymsUseCase();

  const { gyms } = await fetchNearbyGymsQuerySchema.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(200).send({ gyms });
}
