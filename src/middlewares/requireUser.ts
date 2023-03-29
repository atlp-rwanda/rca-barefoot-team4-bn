import { type Request, type Response, type NextFunction } from "express";

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    if (!user) {
      next(new Error("User does not exist"));
      return;
    }

    next();
  } catch (err: any) {
    next(err);
  }
};
