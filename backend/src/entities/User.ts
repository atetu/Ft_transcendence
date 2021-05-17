import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
} from "typeorm";
import Channel from "./Channel";
import ChannelMessage from "./ChannelMessage";
import ChannelUser from "./ChannelUser";
import RefreshToken from "./RefreshToken";

@Entity({
  name: "users",
})
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  username: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  admin: boolean;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: ["remove"],
  })
  refreshTokens: RefreshToken[];

  @OneToMany(() => Channel, (channel) => channel.owner)
  ownerChannels: Promise<Channel[]>;

  @OneToMany(() => ChannelUser, (channelUser) => channelUser.user)
  channelUsers: Promise<ChannelUser[]>;

  @OneToMany(() => ChannelMessage, (channelMessage) => channelMessage.user)
  channelMessages: Promise<ChannelMessage[]>;
}
