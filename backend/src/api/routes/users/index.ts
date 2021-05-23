import * as express from "express";
import Container from "typedi";
import UserService from "../../../services/UserService";
import middlewares from "../../middlewares";
import me from "./me";

export default (app: express.Router) => {
  const userService = Container.get(UserService);

  const route = express.Router();

  app.use("/users", middlewares.authorize(false), route);

  route.get("/", async (req, res, next) => {
    res.status(200).send(await userService.all());
  });

  me(route);

  return route;
};
