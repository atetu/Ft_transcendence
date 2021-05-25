import * as celebrate from "celebrate";
import * as express from "express";
import Container from "typedi";
import Channel, {
  Visibility as ChannelVisibility,
} from "../../../../entities/Channel";
import ChannelService from "../../../../services/ChannelService";
import ChannelUserService from "../../../../services/ChannelUserService";
import middlewares from "../../../middlewares";
import messages from "./messages";
import users from "./users";

export default (app: express.Router) => {
  const channelService = Container.get(ChannelService);

  const route = express.Router();

  app.use(
    "/:id",
    middlewares.pathVariable("id", "channel", async (id) => {
      return await channelService.findById(id);
    }),
    route
  );

  route.get("/", async (req, res, next) => {
    const channel: Channel = res.locals.channel;

    res.status(200).send(channel.toJSON());
  });

  route.delete("/", async (req, res, next) => {
    const channel: Channel = res.locals.channel;

    await channelService.delete(channel);

    res.status(204).end();
  });

  users(route);
  messages(route);

  return route;
};
