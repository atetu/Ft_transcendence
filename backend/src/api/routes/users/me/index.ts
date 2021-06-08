import * as express from "express";
import channels from "./channels";
import achievements from "./achievements";
import relationships from "./relationships";
import middlewares from "../../../middlewares";

export default (app: express.Router) => {
  const route = express.Router();

  app.use("/@me", middlewares.authorize(false), route);

  route.get("/", (req, res, next) => {
    res.status(200).send(req.user);
  });

  achievements(route);
  relationships(route);
  channels(route);

  return route;
};
