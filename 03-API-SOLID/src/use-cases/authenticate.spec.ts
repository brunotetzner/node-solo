import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let UsersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use case", () => {
  beforeEach(() => {
    UsersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(UsersRepository);
  });
  it("Should be able to authenticate", async () => {
    await UsersRepository.create({
      name: "John Doe",
      email: "jondoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "jondoe@example.com",
      password: "123456",
    });
    expect(user.id).toEqual(expect.any(String));
  });

  it("Should be able to authenticate with wrong email", async () => {
    await UsersRepository.create({
      name: "John Doe",
      email: "jondoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(
      async () =>
        await sut.execute({
          email: "jondoe1@example.com",
          password: "123456",
        })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
  it("Should be able to authenticate with wrong password", async () => {
    await UsersRepository.create({
      name: "John Doe",
      email: "jondoe@example.com",
      password_hash: await hash("123456", 6),
    });

    await expect(
      async () =>
        await sut.execute({
          email: "jondoe@example.com",
          password: "1234567",
        })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
