import * as express from "express";
import Container from "typedi";
import ChannelService from "../../../services/ChannelService";
import _id from "./_id";

export default (app: express.Router) => {
  const channelService = Container.get(ChannelService);

  const route = express.Router();

  app.use("/channels", /*middlewares.authorize(false), */ route);

  route.get("/", async (req, res, next) => {
    const channels = await channelService.all();

    res.status(200).send(channels);
  });

  _id(route);

  return route;
};
