import { Service, Inject } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import User from "../entities/User";
import UserRepository from "../repositories/UserRepository";

@Service()
export default class UserService {
  constructor(
    @InjectRepository()
    private readonly repository: UserRepository
  ) {}

  async findById(id: number): Promise<User> {
    return this.repository.findOne(id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.repository.findByEmail(email);
  }

  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async all(): Promise<User[]> {
    return this.repository.find();
  }
}
