import { Inject, Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import Achievement from "../entities/Achievement";
import User from "../entities/User";
import AchievementProgress from "../entities/AchievementProgress";
import AchievementProgressRepository from "../repositories/AchievementProgressRepository";
import SocketService from "./SocketService";

@Service()
export default class AchievementProgressService {
  constructor(
    @InjectRepository()
    private repository: AchievementProgressRepository,

    @Inject()
    private socketService: SocketService
  ) {}

  async allByUser(user: User) {
    return await this.repository.findAllByUser(user);
  }

  async findByAchievementAndUser(achievement: Achievement, user: User) {
    return await this.repository.findByAchievementAndUser(achievement, user);
  }

  private async get(achievement: Achievement, user: User) {
    let progress = await this.findByAchievementAndUser(achievement, user);

    if (progress) {
      return progress;
    }

    progress = new AchievementProgress();
    progress.user = user;
    progress.achievement = achievement;
    progress.value = 0;
    progress.unlockedAt = null;

    await this.repository.save(progress);

    return progress;
  }

  async unlock(achievement: Achievement, user: User) {
    this.set(achievement, user, achievement.max);
  }

  async increment(achievement: Achievement, user: User, value = 1) {
    let unlocked = false;
    const progress = await this.get(achievement, user);

    if (progress.unlocked) {
      return;
    }

    progress.value = Math.min(achievement.max, progress.value + value);

    if (progress.value === achievement.max) {
      progress.unlockedAt = new Date();
      unlocked = true;
    }

    this.repository.save(progress);

    if (unlocked) {
      this.socketService.notifyAchievementUnlock(user, progress);
    }
  }

  async set(achievement: Achievement, user: User, value: number) {
    const progress = await this.get(achievement, user);

    if (progress.value == value) {
      return;
    }

    const unlockedAt = progress.unlockedAt;
    let unlocked = false;

    progress.value = Math.min(achievement.max, value);

    if (progress.value === achievement.max) {
      progress.unlockedAt = new Date();
      unlocked = true;
    } else {
      progress.unlockedAt = null;
    }

    if (unlockedAt !== progress.unlockedAt) {
      this.repository.save(progress);
    }

    if (unlocked) {
      this.socketService.notifyAchievementUnlock(user, progress);
    }
  }
}
