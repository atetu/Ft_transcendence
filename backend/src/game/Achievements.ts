import { Container } from "typedi";
import Achievement from "../entities/Achievement";
import AchievementService from "../services/AchievementService";

function inline(object: Partial<Achievement>) {
  const achievement = new Achievement();

  Object.assign(achievement, object);

  return achievement;
}

export default class Achievements {
  static REGISTERED = inline({
    id: 1000,
    name: "Registered!",
    description: "Create an account",
    percent: true,
    max: 1,
  });

  static COMMUNITY_MEMBER = inline({
    id: 2000,
    name: "Community Member",
    description: "Send 20 messages",
    percent: false,
    max: 20,
  });

  static async install() {
    const achievementService = Container.get(AchievementService);

    for (const value of Object.values(Achievements)) {
      if (!(value instanceof Achievement)) {
        continue;
      }

      await achievementService.save(value);
    }
  }
}
