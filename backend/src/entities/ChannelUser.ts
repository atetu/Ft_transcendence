import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import Channel from "./Channel";
import User from "./User";

@Entity({
  name: "channel_users",
})
export default class ChannelUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Channel, (channel) => channel.users)
  channel: Channel;

  @ManyToOne(() => User, (channel) => channel.channelUsers, { eager: true })
  user: User;

  @Column({
    default: false,
  })
  admin: boolean;

  @Column({
    default: false,
  })
  banned: boolean;

  @Column({
    default: false,
  })
  muted: boolean;

  @Column({
    nullable: true,
  })
  mutedUntil?: Date;

  public toJSON() {
    return {
      id: this.user?.id,
      username: this.user?.username,
      admin: this.admin,
      muted: this.admin,
      mutedUntil: this.admin,
    };
  }
}
