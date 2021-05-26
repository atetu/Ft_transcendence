import * as express from "express";
import { Container } from "typeorm-typedi-extensions";
import ChannelUser from "../../../../../../entities/ChannelUser";
import ChannelUserService from "../../../../../../services/ChannelUserService";

export default (app: express.Router) => {
  const channelUserService = Container.get(ChannelUserService)

  const route = express.Router();

  app.use("/admin", route);

  route.post("/", async (req, res, next) => {
    const channelUser: ChannelUser = res.locals.channelUser

    await channelUserService.setAdmin(channelUser, true)

    res.status(200).send(channelUser)
  });

  route.delete("/", async (req, res, next) => {
    const channelUser: ChannelUser = res.locals.channelUser

    await channelUserService.setAdmin(channelUser, false)

    res.status(200).send(channelUser)
  });

  return route;
};
