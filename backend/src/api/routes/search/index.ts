import * as celebrate from "celebrate";
import * as express from "express";
import { Container } from "typeorm-typedi-extensions";
import Channel from "../../../entities/Channel";
import User from "../../../entities/User";
import SearchService from "../../../services/SearchService";

export default (app: express.Router) => {
  const searchService = Container.get(SearchService);

  const route = express.Router();

  app.use(
    "/search",
    celebrate.celebrate({
      [celebrate.Segments.QUERY]: {
        query: celebrate.Joi.string().required(),
      },
    }),
    route
  );

  route.get("/", async (req, res, next) => {
    const query: string = req.query.query as string;
    const results: { [key: string]: any[] } = await searchService.searchAll(
      query
    );

    res.status(200).send(results);
  });

  route.get("/users", async (req, res, next) => {
    const query: string = req.query.query as string;
    const results: User[] = await searchService.search(User, query);

    res.status(200).send(results);
  });

  route.get("/channels", async (req, res, next) => {
    const query: string = req.query.query as string;
    const results: Channel[] = await searchService.search(Channel, query);

    res.status(200).send(results);
  });

  return route;
};
