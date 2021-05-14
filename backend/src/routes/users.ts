import { NextFunction, Request, Response, Router } from "express";
import { authorizeRoute } from "../middlewares/authorize";

const router = Router();

router.get(
  "/@me",
  authorizeRoute(),
  (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send(req.user);
  }
);

export default router;
