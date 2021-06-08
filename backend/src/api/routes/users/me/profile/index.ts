import * as express from "express";
import settings from "./settings";

export default (app: express.Router) => {
  const route = express.Router();

  app.use("/profile", route);

  settings(route);

  return route;
};
