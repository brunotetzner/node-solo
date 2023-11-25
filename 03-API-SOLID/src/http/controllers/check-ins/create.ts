import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((n) => Math.abs(n) <= 90),
    longitude: z.number().refine((n) => Math.abs(n) <= 180),
  });

  const createCheckInParamsSchema = z.object({ gymId: z.string().uuid() });

  const { gymId } = createCheckInParamsSchema.parse(request.params);
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body);

  const checkInUseCase = makeCheckInUseCase();

  await checkInUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  });
  return reply.status(201).send();
}
