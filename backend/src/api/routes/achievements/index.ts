import * as express from "express";
import Container from "typedi";
import AchievementService from "../../../services/AchievementService";
import _id from "./_id";

export default (app: express.Router) => {
  const achievementService = Container.get(AchievementService);

  const route = express.Router();

  app.use("/achievements", route);

  route.get("/", async (req, res, next) => {
    res.status(200).send(await achievementService.all());
  });

  _id(route);

  return route;
};
