import * as express from "express";
import Container from "typedi";
import Channel from "../../../../entities/Channel";
import ChannelMessageService from "../../../../services/ChannelMessageService";

export default (app: express.Router) => {
  const channelMessageService = Container.get(ChannelMessageService);

  const route = express.Router();

  app.use("/messages", route);

  route.get("/", async (req, res, next) => {
    const channel: Channel = res.locals.channel;
    const users = await channelMessageService.allByChannel(channel);

    res.status(200).send(users);
  });

  return route;
};
