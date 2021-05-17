import * as express from "express";
import Container from "typedi";
import ChannelService from "../../../services/ChannelService";
import oauth from "./oauth";
import refreshToken from "./refresh-token";

export default (app: express.Router) => {
  const channelService = Container.get(ChannelService);

  const route = express.Router();

  app.use("/auth", route);

  oauth(route);
  refreshToken(route);

  return route;
};
