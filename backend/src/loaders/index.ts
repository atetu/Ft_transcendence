import * as express from "express";
import * as http from "http";
import ormLoader from "./orm";
import expressLoader from "./express";
import socketioLoader from "./socket-io";
import Achievements from "../game/Achievements";
import cronLoader from "./cron";
import { Container } from "typeorm-typedi-extensions";
import AvatarService from "../services/AvatarService";

export default async ({
  app,
  server,
}: {
  app: express.Application;
  server: http.Server;
}) => {
  await ormLoader();
  await expressLoader({ app });
  await socketioLoader({ server });
  await cronLoader();

  await Achievements.install();
  await Container.get(AvatarService).install();
};
