import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import User from "../entities/User";
import RelationshipRepository from "../repositories/RelationshipRepository";

@Service()
export default class RelationshipService {
  constructor(
    @InjectRepository()
    private readonly repository: RelationshipRepository
  ) {}

  async all(user: User) {
    return this.repository.findAllByUser(user)
  }
}
