import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import Channel from "./Channel";
import User from "./User";

export enum Type {
  TEXT = "text",
  INVITE = "invite",
}

@Entity({
  name: "channel_messages",
})
export default class ChannelMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Channel, (channel) => channel.messages)
  channel: Promise<Channel>;

  @ManyToOne(() => User, (channel) => channel.channelMessages, { eager: true })
  user: User;

  @Column({
    type: "enum",
    enum: Type,
    default: Type.TEXT,
  })
  type: Type;

  @Column()
  content: string;

  public toJSON() {
    return {
      id: this.id,
      user: {
        id: this.user.id,
        username: this.user.username,
      },
      type: this.type,
      content: this.content,
    };
  }
}
