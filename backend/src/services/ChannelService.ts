import { Inject, Service, Container } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import Channel from "../entities/Channel";
import ChannelRepository from "../repositories/ChannelRepository";
import SocketService from "./SocketService";

@Service()
export default class ChannelService {
  private get socketService() {
    return Container.get(SocketService);
  }

  constructor(
    @InjectRepository()
    private repository: ChannelRepository
  ) {}

  public async all() {
    return await this.repository.find();
  }

  public async findById(id: number) {
    return await this.repository.findOne(id);
  }

  public async create(channel: Channel) {
    await this.repository.save(channel);

    this.socketService.broadcastNewChannel(channel);

    console.log(channel)
    console.log(channel.toJSON())

    return channel;
  }
}
