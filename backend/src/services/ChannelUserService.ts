import { Inject, Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import Channel from "../entities/Channel";
import ChannelUser from "../entities/ChannelUser";
import User from "../entities/User";
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

  public async findByChannelAndUser(channel: Channel, user: User) {
    return await this.repository.findByChannelAndUser(channel, user);
  }

  public async setAdmin(channelUser: ChannelUser, state: boolean) {
    if (channelUser.admin != state) {
      channelUser.admin = state;
      
      await this.repository.save(channelUser);
    }
  }

  public async setBanned(channelUser: ChannelUser, state: boolean) {
    if (channelUser.banned != state) {
      channelUser.banned = state;
      
      await this.repository.save(channelUser);
    }
  }

  public async createOwner(channel: Channel) {
    const user = channel.owner;

    const channelUser = new ChannelUser();
    channelUser.user = user;
    channelUser.channel = channel;
    channelUser.admin = true;

    await this.repository.save(channelUser);

    return channelUser;
  }
}
