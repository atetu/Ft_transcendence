import * as express from "express";

export default (app: express.Router) => {
  const route = express.Router();

  app.use("/ban", route);

  route.post("/", async (req, res, next) => {
    next(); // TODO Need implementation
  });

  route.delete("/", async (req, res, next) => {
    next(); // TODO Need implementation
  });

  return route;
};
