import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
} from "typeorm";

import User from "./User";

@Entity({
  name: "refresh_tokens",
})
export default class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: User;

  @Index({ unique: true })
  @Column()
  token: string;

  @Index()
  @Column()
  expires: Date;

  @Index()
  @Column()
  created: Date = new Date(Date.now());

  @Index()
  @Column({ nullable: true })
  revoked?: Date;

  public get expired() {
    return new Date(Date.now()) >= this.expires;
  }

  public get active() {
    return !this.revoked && !this.expired;
  }
}
