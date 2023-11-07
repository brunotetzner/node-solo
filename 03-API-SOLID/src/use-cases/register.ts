import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}
export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}
  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const userWithTheSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithTheSameEmail) {
      throw new UserAlreadyExistsError();
    }
    const password_hash = await hash(password, 6);

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    });
  }
}
