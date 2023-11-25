import { fastify } from "fastify";
import { ZodError } from "zod";
import { env } from "./env";
import fastifyJwt from "@fastify/jwt";
import { userRoutes } from "./http/controllers/users/routes";
import { gymRoutes } from "./http/controllers/gyms/routes";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});
app.register(userRoutes);
app.register(gymRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    reply
      .status(400)
      .send({ message: "validation error", issue: error.format() });
    return;
  }
  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // TODO: log error to external service
  }
  reply.status(500).send({ message: "internal server error" });
});
