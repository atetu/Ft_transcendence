import * as celebrate from "celebrate";
import * as express from "express";
import Container from "typedi";
import Achievement from "../../../../entities/Achievement";
import AchievementService from "../../../../services/AchievementService";

export default (app: express.Router) => {
  const achievementService = Container.get(AchievementService);

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
        const achievement = await achievementService.findById(id);

        if (!achievement) {
          res.status(404).send({
            message: `no achievement with id = ${id}`
          });
          return
        }

        res.locals.achievement = achievement;

        next();
      } catch (error) {
        next(error);
      }
    },
    route
  );

  route.get("/", async (req, res, next) => {
    const achievement: Achievement = res.locals.achievement;

    res.status(200).send(achievement);
  });

  return route;
};
