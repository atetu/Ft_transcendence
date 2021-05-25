import * as express from "express";
import Container from "typedi";
import User from "../../../../../entities/User";
import RelationshipService from "../../../../../services/RelationshipService";

export default (app: express.Router) => {
  const relationshipService = Container.get(RelationshipService)

  const route = express.Router();

  app.use("/relationships", route);

  route.get("/", async (req, res, next) => {
    const user: User = req.user as any
    const relationships = await relationshipService.all(user)

    res.status(200).send(relationships);
  });

  return route;
};
