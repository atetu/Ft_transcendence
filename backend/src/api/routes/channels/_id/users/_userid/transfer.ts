import * as express from "express";
import { Container } from "typeorm-typedi-extensions";
import Channel from "../../../../../../entities/Channel";
import ChannelUser from "../../../../../../entities/ChannelUser";
import ChannelService from "../../../../../../services/ChannelService";

export default (app: express.Router) => {
  const channelService = Container.get(ChannelService);

  const route = express.Router();

  app.use("/transfer", route);

  route.post("/", async (req, res, next) => {
    const channel: Channel = res.locals.channel;
    const channelUser: ChannelUser = res.locals.channelUser;

    await channelService.transferOwnership(channel, channelUser);

    res.status(200).send(channel);
  });

  return route;
};
