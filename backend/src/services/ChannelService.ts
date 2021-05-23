import { Inject, Service, Container } from "typedi";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import Channel from "../entities/Channel";
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

  public async create(channel: Channel) { // TODO: Transactional?
    await this.repository.save(channel);
    await this.channelUserService.createOwner(channel);

    this.socketService.broadcastNewChannel(channel);

    return channel;
  }

  async delete(channel: Channel) {
    await this.repository.delete(channel);
  }
}
