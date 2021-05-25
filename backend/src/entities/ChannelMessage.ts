import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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

  @ManyToOne(() => Channel, {
    onDelete: "CASCADE",
  })
  channel: Channel;

  @ManyToOne(() => User, {
    eager: true,
    onDelete: "CASCADE",
  })
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

  static Type = Type
}
