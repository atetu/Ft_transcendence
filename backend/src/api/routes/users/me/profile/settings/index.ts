import * as express from "express";

export default (app: express.Router) => {
  const route = express.Router();

  app.use("/settings", route);

  return route;
};
