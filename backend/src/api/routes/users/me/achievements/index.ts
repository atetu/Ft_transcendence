import * as express from "express";
import Container from "typedi";
import Achievement from "../../../../../entities/Achievement";
import User from "../../../../../entities/User";
import Achievements from "../../../../../game/Achievements";
import AchievementProgressService from "../../../../../services/AchievementProgressService";
import AchievementService from "../../../../../services/AchievementService";
import _id from "./_id";

export default (app: express.Router) => {
  const achievementService = Container.get(AchievementService);
  const achievementProgressService = Container.get(AchievementProgressService);

  const route = express.Router();

  app.use("/achievements", route);

  route.get("/", async (req, res, next) => {
    const user: User = req.user as any;
    const achievementProgresses = await achievementProgressService.allByUser(
      user
    );

    res.status(200).send(achievementProgresses);
  });

  _id(route);

  return route;
};
