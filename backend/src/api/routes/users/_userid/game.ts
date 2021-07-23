import * as celebrate from "celebrate";
import * as express from "express";
import Container from "typedi";
import User from "../../../../entities/User";
import GameService from "../../../../services/GameService";
import UserService from "../../../../services/UserService";
import helpers from "../../../helpers";
import achievements from "./achievements";

export default (app: express.Router) => {
  const gameService = Container.get(GameService);

  const route = express.Router();

  app.use("/game", route);

  route.get("/", async (req, res, next) => {
    const user: User = res.locals.user;

    try {
      const game = gameService.findByUser(user);
      if (!game) {
        return helpers.notFound("user not in game");
      }

      res.status(200).send(game);
    } catch (error) {
      next(error);
    }
  });

  return route;
};
