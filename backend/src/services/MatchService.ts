import { Service, Inject } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import Match from "../entities/Match";
import MatchRepository from "../repositories/MatchRepository";


@Service()
export default class MatchService {
  constructor(
    @InjectRepository()
    private readonly repository: MatchRepository
  ) {}

//   async findById(id: number): Promise<User> {
//     return this.repository.findOne(id);
//   }

//   async findByEmail(email: string): Promise<User> {
//     return this.repository.findByEmail(email);
//   }

  async save(match: Match): Promise<Match> {
    return this.repository.save(match);
  }

//   async all(): Promise<User[]> {
//     return this.repository.find();
//   }
}