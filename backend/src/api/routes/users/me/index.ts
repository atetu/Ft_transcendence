import * as express from "express";
import achievements from "./achievements";
import relationships from "./relationships";

export default (app: express.Router) => {
  const route = express.Router();

  app.use("/@me", route);

  route.get("/", (req, res, next) => {
    res.status(200).send(req.user);
  });

  achievements(route);
  relationships(route);

  return route;
};
