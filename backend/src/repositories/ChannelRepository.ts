import { Service } from "typedi";
import { Repository, EntityRepository } from "typeorm";
import Channel from "../entities/Channel";

@Service()
@EntityRepository(Channel)
export default class ChannelRepository extends Repository<Channel> {}
