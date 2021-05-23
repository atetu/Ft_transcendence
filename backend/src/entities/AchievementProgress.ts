import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Achievement from "./Achievement";
import User from "./User";

@Entity({
  name: "achievement_progresses",
})
export default class AchievementProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (x) => x.achievementProgresses, {
    onDelete: "CASCADE",
  })
  user: Promise<User>;

  @ManyToOne(() => Achievement, (x) => x.progresses, {
    eager: true,
    onDelete: "CASCADE",
  })
  achievement: Achievement;

  @Column()
  value: number;

  @Column({ nullable: true })
  unlockedAt?: Date;

  public toJSON() {
    return {
      value: this.value,
      unlockedAt: this.unlockedAt,
      achievement: this.achievement.toJSON(),
    };
  }

  get unlocked() {
    return !!this.unlockedAt;
  }
}
