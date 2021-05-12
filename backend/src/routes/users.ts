import { NextFunction, Request, Response, Router } from "express";
import authorize from "../middlewares/authorize";

const router = Router();

router.get(
  "/@me",
  authorize(),
  (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send(req.user);
  }
);

export default router;
