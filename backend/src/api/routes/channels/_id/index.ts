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

  route.post(
    "/",
    celebrate.celebrate({
      [celebrate.Segments.BODY]: {
        name: celebrate.Joi.string().required(),
        visibility: celebrate.Joi.string()
          .valid(
            ChannelVisibility.PUBLIC,
            ChannelVisibility.PROTECTED,
            ChannelVisibility.PRIVATE
          )
          .required(),
        password: celebrate.Joi.string().when("visibility", {
          is: celebrate.Joi.equal(ChannelVisibility.PROTECTED),
          then: celebrate.Joi.required(),
          otherwise: celebrate.Joi.forbidden(),
        }),
      },
    }),
    async (req, res, next) => {
      const channel: Channel = res.locals.channel;

      const { name, visibility, password } = req.body as {
        name: string;
        visibility: ChannelVisibility;
        password?: string;
      };

      try {
        channel.name = name;
        channel.visibility = visibility;
        channel.password = password;

        await channel.updatePasswordHash()
        await channelService.update(channel);

        res.status(200).send(channel.toJSON());
      } catch (error) {
        next(error);
      }
    }
  );

  route.delete("/", async (req, res, next) => {
    const channel: Channel = res.locals.channel;

    await channelService.delete(channel);

    res.status(204).end();
  });

  users(route);
  messages(route);

  return route;
};
