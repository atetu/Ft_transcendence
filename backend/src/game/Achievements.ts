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
    description: "Send 100 messages",
    percent: true,
    max: 100,
  });

  static COMMUNITY_CREATOR = inline({
    id: 2100,
    name: "Community Creator",
    description: "Create a channel",
    percent: false,
    max: 1,
  });

  static COMMUNITY_GROWER = inline({
    id: 2200,
    name: "Community Grower",
    description: "Invite someone to a channel",
    percent: false,
    max: 1,
  });

  static ONE_OF_US = inline({
    id: 2300,
    name: "One of us!",
    description: "Join a protected channel",
    percent: false,
    max: 1,
  });

  static BEGINNER = inline({
    id: 3000,
    name: "Beginner",
    description: "Play your first game",
    percent: false,
    max: 1,
  });

  static INTERMEDIATE = inline({
    id: 3100,
    name: "Intermediate",
    description: "Play 10 game",
    percent: false,
    max: 10,
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
