import { Service } from "typedi";
import { Repository, EntityRepository } from "typeorm";
import User from "../entities/User";

@Service()
@EntityRepository(User)
export default class UserRepository extends Repository<User> {
  public findByUsername(username: string) {
    return this.findOne({ username });
  }

  public findByEmail(email: string) {
    return this.findOne({ email });
  }
}
