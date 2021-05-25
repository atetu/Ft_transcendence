import * as express from "express";
import Container from "typedi";
import Channel from "../../../../../entities/Channel";
import ChannelUserService from "../../../../../services/ChannelUserService";
import _userid from "./_userid";

export default (app: express.Router) => {
  const channelUserService = Container.get(ChannelUserService);

  const route = express.Router();

  app.use("/users", route);

  route.get("/", async (req, res, next) => {
    const channel: Channel = res.locals.channel;
    const users = await channelUserService.allByChannel(channel);

    res.status(200).send(users);
  });

  _userid(route);

  return route;
};
