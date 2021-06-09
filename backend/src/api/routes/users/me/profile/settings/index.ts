import * as express from "express";
import otp from "./otp";

export default (app: express.Router) => {
  const route = express.Router();

  app.use("/settings", route);

  otp(route);

  return route;
};
