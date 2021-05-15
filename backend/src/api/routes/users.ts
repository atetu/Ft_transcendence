import * as passport from "passport";
import * as celebrate from "celebrate";
import * as express from "express";

import middlewares from "../middlewares";

export default (app: express.Router) => {
  const route = express.Router();

  app.use("/users", route);

  route.get("/@me", middlewares.authorize(false), (req, res, next) => {
    res.status(200).send(req.user);
  });

  return route;
};
