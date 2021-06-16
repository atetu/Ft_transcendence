import * as celebrate from "celebrate";
import * as express from "express";
import Container from "typedi";
import AchievementProgress from "../../../../../entities/AchievementProgress";
import User from "../../../../../entities/User";
import AchievementProgressService from "../../../../../services/AchievementProgressService";
import AchievementService from "../../../../../services/AchievementService";

export default (app: express.Router) => {
  const achievementService = Container.get(AchievementService);
  const achievementProgressService = Container.get(AchievementProgressService);

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
      const user: User = req.user as any;

      try {
        const achievement = await achievementService.findById(id);

        if (!achievement) {
          res.status(404).send({
            message: `no achievement with id = ${id}`,
          });
          return;
        }

        const achievementProgress =
          await achievementProgressService.findByAchievementAndUser(
            achievement,
            user
          );

        res.locals.achievement = achievement;
        res.locals.achievementProgress =
          achievementProgress ||
          ({
            id: 0,
            user: Promise.resolve(user),
            achievement,
            value: 0,
            unlockedAt: null,
          } as AchievementProgress);

        next();
      } catch (error) {
        next(error);
      }
    },
    route
  );

  route.get("/", async (req, res, next) => {
    const achievementProgress: AchievementProgress =
      res.locals.achievementProgress;

    res.status(200).send(achievementProgress.toJSON());
  });

  return route;
};
