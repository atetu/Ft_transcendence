import { Container, Inject, Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import Channel from "../entities/Channel";
import ChannelUser from "../entities/ChannelUser";
import ChannelRepository from "../repositories/ChannelRepository";
import ChannelUserService from "./ChannelUserService";
import SocketService from "./SocketService";

@Service()
export default class ChannelService {
  private get socketService() {
    return Container.get(SocketService);
  }

  constructor(
    @InjectRepository()
    private repository: ChannelRepository,

    @Inject()
    private channelUserService: ChannelUserService
  ) {}

  public async all() {
    return await this.repository.find();
  }

  public async findById(id: number) {
    return await this.repository.findOne(id);
  }

  public async create(channel: Channel) {
    // TODO: Transactional?
    await this.repository.save(channel);
    await this.channelUserService.createOwner(channel);

    this.socketService.broadcastNewChannel(channel);

    return channel;
  }

  public async update(channel: Channel) {
    await this.repository.save(channel);
  }

  public async transferOwnership(channel: Channel, channelUser: ChannelUser) {
    channel.owner = channelUser.user;

    await this.channelUserService.setAdmin(channelUser, true);
    await this.repository.save(channel);

    return channel;
  }

  async delete(channel: Channel) {
    await this.repository.delete(channel);
  }
}
