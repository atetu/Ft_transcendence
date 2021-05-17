import { Inject, Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import Channel from "../entities/Channel";
import { ChannelUserRepository } from "../repositories/ChannelUserRepository";

@Service()
export default class ChannelUserService {
  constructor(
    @InjectRepository()
    private repository: ChannelUserRepository
  ) {}

  public async all() {
    return await this.repository.find();
  }

  public async allByChannel(channel: Channel) {
    return await this.repository.find({ channel });
  }
}
