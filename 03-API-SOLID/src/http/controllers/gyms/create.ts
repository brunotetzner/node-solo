import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeCreateGymsUseCase } from "@/use-cases/factories/make-create-gym-use-case";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymSchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.coerce.number().refine((n) => Math.abs(n) <= 90),
    longitude: z.coerce.number().refine((n) => Math.abs(n) <= 180),
  });
  const { title, description, phone, latitude, longitude } =
    createGymSchema.parse(request.body);

  const createGymUseCase = makeCreateGymsUseCase();
  await createGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  });
  return reply.status(201).send();
}
