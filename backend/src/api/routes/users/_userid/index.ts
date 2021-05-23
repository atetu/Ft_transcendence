import * as celebrate from "celebrate";
import * as express from "express";
import Container from "typedi";
import User from "../../../../entities/User";
import UserService from "../../../../services/UserService";
import achievements from "./achievements";

export default (app: express.Router) => {
  const userService = Container.get(UserService);

  const route = express.Router();

  app.use(
    "/:userid",
    celebrate.celebrate({
      [celebrate.Segments.PARAMS]: {
        userid: celebrate.Joi.number().required(),
      },
    }),
    async (req, res, next) => {
      const id = Number(req.params.userid);

      try {
        const user = await userService.findById(id);
        res.locals.user = user;

        next();
      } catch (error) {
        next(error);
      }
    },
    route
  );

  route.get("/", async (req, res, next) => {
    const user: User = res.locals.user;

    res.status(200).send(user.toJSON());
  });

  achievements(route);

  return route;
};
