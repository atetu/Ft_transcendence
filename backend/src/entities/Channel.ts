import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import ChannelMessage from "./ChannelMessage";
import ChannelUser from "./ChannelUser";
import User from "./User";

export enum Type {
  DIRECT = "direct",
  GROUP = "group",
}

export enum Visibility {
  PUBLIC = "public",
  PROTECTED = "protected",
  PRIVATE = "private",
}

@Entity({
  name: "channels",
})
export default class Channel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: "enum",
    enum: Type,
    default: Type.GROUP,
  })
  type: Type;

  @Column({
    type: "enum",
    enum: Visibility,
    default: Visibility.PUBLIC,
  })
  visibility: Visibility;

  @ManyToOne(() => User, (user) => user.ownerChannels, { eager: true })
  owner: User;

  @OneToMany(() => ChannelUser, (channelUser) => channelUser.channel)
  users: Promise<ChannelUser[]>;

  @OneToMany(() => ChannelMessage, (channelMessage) => channelMessage.channel)
  messages: Promise<ChannelMessage[]>;

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      visibility: this.visibility,
      owner: this.owner
        ? {
            id: this.owner.id,
            username: this.owner.username,
            admin: this.owner.admin,
          }
        : undefined,
    };
  }
}
