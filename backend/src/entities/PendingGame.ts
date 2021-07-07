import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import ChannelMessage from "./ChannelMessage";
import User from "./User";

@Entity({
  name: "pending_games",
})
export default class PendingGame {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, {
    eager: true,
    onDelete: "CASCADE",
    nullable: false,
  })
  user: User;

  @ManyToOne(() => User, {
    eager: true,
    onDelete: "CASCADE",
    nullable: false,
  })
  peer: User;

  @ManyToOne(() => ChannelMessage, {
    eager: false,
    onDelete: "CASCADE",
  })
  message: Promise<ChannelMessage>;

  public toJSON() {
    return {
      id: this.id,
      user: this.user,
      peer: this.peer,
    };
  }
}
