import { Service } from "typedi";
import { Repository, EntityRepository } from "typeorm";
import Match from "../entities/Match";

@Service()
@EntityRepository(Match)
export default class MatchRepository extends Repository<Match> {}