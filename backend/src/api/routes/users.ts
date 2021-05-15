import * as passport from "passport";
import * as celebrate from "celebrate";
import * as express from "express";

import middlewares from "../middlewares";
import Container from "typedi";
import UserService from "../../services/UserService";

export default (app: express.Router) => {
  const userService = Container.get(UserService);

  const route = express.Router();

  app.use("/users", route);

  route.get("/", async (req, res, next) => {
    res.status(200).send(await userService.all());
  });

  route.get("/@me", middlewares.authorize(false), (req, res, next) => {
    res.status(200).send(req.user);
  });

  return route;
};
