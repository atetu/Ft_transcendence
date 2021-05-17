import * as express from "express";

export default (app: express.Router) => {
  const route = express.Router();

  app.use("/@me", route);

  route.get("/", (req, res, next) => {
    res.status(200).send(req.user);
  });

  return route;
};
