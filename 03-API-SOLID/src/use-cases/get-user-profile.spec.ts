import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found";

let UsersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get user profile use case", () => {
  beforeEach(() => {
    UsersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(UsersRepository);
  });
  it("Should be able to get user profile", async () => {
    const createdUser = await UsersRepository.create({
      name: "John Doe",
      email: "jondoe@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });
    expect(user.name).toEqual(createdUser.name);
  });

  it("Should not be able to get user profile with a wrong id", async () => {
    expect(() =>
      sut.execute({ userId: "non-existing-id" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
