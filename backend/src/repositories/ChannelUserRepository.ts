import { Service } from "typedi";
import { Repository, EntityRepository } from "typeorm";
import ChannelUser from "../entities/ChannelUser";

@Service()
@EntityRepository(ChannelUser)
export class ChannelUserRepository extends Repository<ChannelUser> {}
