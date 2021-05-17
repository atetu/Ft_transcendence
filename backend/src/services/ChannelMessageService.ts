import { Inject, Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import Channel from "../entities/Channel";
import ChannelMessageRepository from "../repositories/ChannelMessageRepository";

@Service()
export default class ChannelMessageService {
  constructor(
    @InjectRepository()
    private repository: ChannelMessageRepository
  ) {}

  public async all() {
    return await this.repository.find();
  }

  public async allByChannel(channel: Channel) {
    return await this.repository.find({ channel });
  }
}
