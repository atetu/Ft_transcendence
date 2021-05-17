import { Inject, Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { ChannelRepository } from "../repositories/ChannelRepository";

@Service()
export default class ChannelService {
  constructor(
    @InjectRepository()
    private channelRepository: ChannelRepository
  ) {}

  public async all() {
    return await this.channelRepository.find();
  }

  public async findById(id: number) {
    return await this.channelRepository.findOne(id);
  }
}
