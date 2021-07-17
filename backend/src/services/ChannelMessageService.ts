import { Inject, Service, Container } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import Channel from "../entities/Channel";
import ChannelMessage from "../entities/ChannelMessage";
import ChannelMessageRepository from "../repositories/ChannelMessageRepository";
import SocketService from "../services/SocketService";
import ChannelService from "../services/ChannelService";
import UserService from "../services/UserService";

@Service()
export default class ChannelMessageService {
  constructor(
    @InjectRepository()
    private repository: ChannelMessageRepository,

    @Inject()
    private socketService: SocketService
  ) {
    // setInterval(async () => {
    //   const channel = await Container.get(ChannelService).findById(1);
    //   const user = await Container.get(UserService).findById(1);
    //   const message = new ChannelMessage();
    //   message.channel = channel
    //   message.user = user
    //   message.content = "Hello: " + Date.now()
    //   this.create(message);
    // }, 1000);
  }

  public async all() {
    return await this.repository.find();
  }

  public async allByChannel(channel: Channel) {
    return await this.repository.find({
      where: { channel },
      order: {
        id: "ASC",
      },
    });
  }

  public async findById(id: number) {
    return await this.repository.findOne(id);
  }

  public async create(message: ChannelMessage) {
    await this.repository.save(message);

    this.socketService.broadcastChannelMessage(message);

    return message;
  }

  public async delete(message: ChannelMessage): Promise<void> {
    await this.repository.delete(message);

    this.socketService.broadcastChannelMessageDelete(message);
  }

  public async deleteAllByChannel(channel: Channel): Promise<void> {
    await this.repository.delete({
      channel,
    });

    this.socketService.broadcastChannelMessageDeleteAll(channel);
  }
}
