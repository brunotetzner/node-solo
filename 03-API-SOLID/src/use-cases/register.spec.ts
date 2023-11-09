import { describe, expect, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists";

let UsersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use case", () => {
  beforeEach(() => {
    UsersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(UsersRepository);
  });
  it("Should be able to register", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "jondoe@example.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });
  it("Should hash userpaasword upon registration", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "jondoe@example.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("Should not be able to register with same email twice", async () => {
    const email = "Jondoe@gmail.com";

    await sut.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    expect(
      async () =>
        await sut.execute({
          name: "John Doe",
          email,
          password: "123456",
        })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
