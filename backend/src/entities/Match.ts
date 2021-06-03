import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Channel from "./Channel";
import User from "./User";

@Entity({
  name: "matches",
})
export default class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, {
    eager: true,
    onDelete: "CASCADE",
  })
  player1: User;

  @ManyToOne(() => User, {
    eager: true,
    onDelete: "CASCADE",
  })
  player2: User;
  // @Column({
  //   default: false,
  // })
  // player1: User;

  // @Column({
  //   default: false,
  // })
  // player2: User;

  @Column({
    default: false,
  })
  score1: number;

  @Column({
    default: false,
  })
  score2: number;

  @ManyToOne(() => User, {
    eager: true,
    onDelete: "CASCADE",
  })
  winner: User;

  // @Column({
  //   default: false,
  // })
  // winner: User;

  public toJSON() {
    return {
      player1: this.player1,
      player2: this.player2,
      score1: this.score1,
      score2: this.score2,
      winner: this.winner,
    };
  }
}