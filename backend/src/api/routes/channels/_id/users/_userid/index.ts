import * as celebrate from "celebrate";
import * as express from "express";
import Container from "typedi";
import Channel from "../../../../../../entities/Channel";
import ChannelUser from "../../../../../../entities/ChannelUser";
import User from "../../../../../../entities/User";
import ChannelUserService from "../../../../../../services/ChannelUserService";
import middlewares from "../../../../../middlewares";
import admin from "./admin";
import ban from "./ban";
import mute from "./mute";
import transfer from "./transfer";

export default (app: express.Router) => {
  const channelUserService = Container.get(ChannelUserService);

  const route = express.Router();

  app.use(
    "/:userid",
    middlewares.pathVariable("userid", "channelUser", async (id, _req, res) => {
      const channel: Channel = res.locals.channel;
      const user: User = { id } as User;

      return await channelUserService.findByChannelAndUser(channel, user);
    }),
    route
  );

  route.get("/", async (req, res, next) => {
    const channelUser: ChannelUser = res.locals.channelUser;

    res.status(200).send(channelUser);
  });

  admin(route);
  ban(route);
  mute(route);
  transfer(route);

  return route;
};
