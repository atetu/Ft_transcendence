import * as express from "express";
import oauth from "./oauth";
import refreshToken from "./refresh-token";
import unlock from "./unlock";

export default (app: express.Router) => {
  const route = express.Router();

  app.use("/auth", route);

  oauth(route);
  refreshToken(route);
  unlock(route);

  return route;
};
