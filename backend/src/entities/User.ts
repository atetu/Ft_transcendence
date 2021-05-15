import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
} from "typeorm";

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
}
