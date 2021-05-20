import { Inject, Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import Channel from "../entities/Channel";
import ChannelUser from "../entities/ChannelUser";
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

  public async createOwner(channel: Channel) {
    const user = channel.owner

    const channelUser = new ChannelUser()
    channelUser.user = user
    channelUser.channel = channel
    channelUser.admin = true

    await this.repository.save(channelUser)

    return channelUser
  }
}
