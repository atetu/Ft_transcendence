import * as express from "express";
import * as celebrate from "celebrate";
import Container from "typedi";
import Channel from "../../../../entities/Channel";
import ChannelMessage, {
  Type as ChannelMessageType,
} from "../../../../entities/ChannelMessage";
import ChannelMessageService from "../../../../services/ChannelMessageService";
import User from "../../../../entities/User";

export default (app: express.Router) => {
  const channelMessageService = Container.get(ChannelMessageService);

  const route = express.Router();

  app.use("/messages", route);

  route.get("/", async (req, res, next) => {
    const channel: Channel = res.locals.channel;
    const users = await channelMessageService.allByChannel(channel);

    res.status(200).send(users);
  });

  route.post(
    "/",
    celebrate.celebrate({
      [celebrate.Segments.BODY]: {
        type: celebrate.Joi.string().valid(ChannelMessageType.TEXT).required(),
        content: celebrate.Joi.string().required(),
      },
    }),
    async (req, res, next) => {
      const channel: Channel = res.locals.channel;
      const user: User = req.user as any;

      const { type, content } = req.body;

      try {
        const message = new ChannelMessage()
        message.channel = channel
        message.user = user
        message.type = type
        message.content = content

        channelMessageService.create(message)

        res.status(200).send(message);
      } catch (error) {
        next(error);
      }
    }
  );

  route.use(celebrate.errors())

  return route;
};
