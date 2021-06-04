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

  public async findAllByUserAndNotBanned(user: User) {
    return await this.repository.findAllByUserAndNotBannedIncludeChannel(user);
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

  public async setMuted(
    channelUser: ChannelUser,
    state: boolean,
    duration: number | null
  ) {
    channelUser.muted = state;

    if (!state || duration == null) {
      channelUser.mutedUntil = null;
    } else {
      channelUser.mutedUntil = new Date(Date.now() + duration * 1000);
    }

    await this.repository.save(channelUser);
  }

  public async createOwner(channel: Channel) {
    const user = channel.owner;

    return this.create(channel, user, true);
  }

  public async create(
    channel: Channel,
    user: User,
    admin = false
  ): Promise<ChannelUser> {
    const channelUser = new ChannelUser();
    channelUser.user = user;
    channelUser.channel = channel;
    channelUser.admin = admin;

    await this.repository.save(channelUser);

    return channelUser;
  }

  public async delete(channelUser: ChannelUser) {
    this.repository.delete(channelUser);
  }

  public async unmuteAllIfPassed() {
    const channelUsers =
      await this.repository.findAllByMutedTrueAndMutedUntilLessThan(new Date());

    if (channelUsers.length) {
      for (const channelUser of channelUsers) {
        channelUser.muted = false;
        channelUser.mutedUntil = null;
      }

      await this.repository.save(channelUsers);

      console.log(`Unumuted ${channelUsers.length} user(s)`)
    }
  }
}
