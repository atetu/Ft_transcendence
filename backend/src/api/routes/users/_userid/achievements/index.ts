import * as express from "express";
import Container from "typedi";
import User from "../../../../../entities/User";
import AchievementProgressService from "../../../../../services/AchievementProgressService";
import _id from "./_id";

export default (app: express.Router) => {
  const achievementProgressService = Container.get(AchievementProgressService);

  const route = express.Router();

  app.use("/achievements", route);

  route.get("/", async (req, res, next) => {
    const user: User = res.locals.user;
    const achievementProgresses = await achievementProgressService.allByUser(
      user
    );

    res.status(200).send(achievementProgresses);
  });

  _id(route)

  return route;
};
