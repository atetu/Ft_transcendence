import * as express from "express";
import * as cors from "cors";
import * as morgan from "morgan";
import * as passport from "passport";
import * as celebrate from "celebrate";

import routes from "../api";

export default async ({ app }: { app: express.Application }) => {
  app.get("/status", (req, res) => {
    res.status(200).end();
  });

  app.enable("trust proxy");

  app.use(morgan("tiny"));

  app.use(cors());

  app.use((req, res, next) => {
      res.header('Content-Type', 'application/json');
      next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(passport.initialize());

  app.use(routes());

  app.use((req, res, next) => {
    const err = new Error("not found");
    err["status"] = 404;
    next(err);
  });

  app.use(celebrate.errors())

  app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
      return res.status(err.status).send({ message: err.message });
    }

    return next(err);
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
      errors: {
        message: err.message,
      },
    });
  });
};