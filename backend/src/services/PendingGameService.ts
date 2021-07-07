import { Inject, Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import ChannelMessage from "../entities/ChannelMessage";
import PendingGame from "../entities/PendingGame";
import User from "../entities/User";
import PendingGameRepository from "../repositories/PendingGameRepository";
import ChannelMessageService from "./ChannelMessageService";
import DirectMessageService from "./DirectMessageService";

@Service()
export default class PendingGameService {
  constructor(
    @InjectRepository()
    private readonly repository: PendingGameRepository,

    @Inject()
    private readonly directMessageService: DirectMessageService,

    @Inject()
    private readonly channelMessageService: ChannelMessageService
  ) {}

  public async create(user: User, peer: User): Promise<PendingGame> {
    const pendingGame = new PendingGame();
    pendingGame.user = user;
    pendingGame.peer = peer;

    await this.repository.save(pendingGame);

    const { channel } = await this.directMessageService.getOrCreate(user, peer);

    const message = new ChannelMessage();
    message.channel = channel;
    message.user = user;
    message.type = ChannelMessage.Type.INVITE;
    message.content = JSON.stringify({
      id: pendingGame.id,
      state: "pending",
    });

    await this.channelMessageService.create(message);

    pendingGame.message = Promise.resolve(message);
    await this.repository.save(pendingGame);

    return pendingGame;
  }
}
