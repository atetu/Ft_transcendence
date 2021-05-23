import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import AchievementProgress from "./AchievementProgress";

@Entity({
  name: "achievements",
})
export default class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  percent: boolean;

  @Column()
  max: number;

  @OneToMany(
    () => AchievementProgress,
    (achievementProgress) => achievementProgress.achievement
  )
  progresses: Promise<AchievementProgress[]>;

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      percent: this.percent,
      max: this.max,
    };
  }
}
