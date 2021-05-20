import * as celebrate from "celebrate";
import * as express from "express";
import Container from "typedi";
import Channel, { Visibility as ChannelVisibility } from "../../../../entities/Channel";
import ChannelService from "../../../../services/ChannelService";
import ChannelUserService from "../../../../services/ChannelUserService";
import messages from "./messages";
import users from "./users";

export default (app: express.Router) => {
  const channelService = Container.get(ChannelService);
  const channelUserService = Container.get(ChannelUserService);

  const route = express.Router();

  app.use(
    "/:id",
    celebrate.celebrate({
      [celebrate.Segments.PARAMS]: {
        id: celebrate.Joi.number().required(),
      },
    }),
    async (req, res, next) => {
      const id = Number(req.params.id);

      try {
        const channel = await channelService.findById(id);
        res.locals.channel = channel;

        next();
      } catch (error) {
        next(error);
      }
    },
    route
  );

  route.get("/", async (req, res, next) => {
    const channel: Channel = res.locals.channel;
    const users = await channelUserService.allByChannel(channel);

    res.status(200).send({
      ...channel.toJSON(),
      users,
    });
  });

  users(route);
  messages(route);

  return route;
};
