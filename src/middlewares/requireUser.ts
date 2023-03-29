import { type Request, type Response, type NextFunction } from "express";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    if (user === null) {
      next(new Error("User does not exist"));
      return;
    }

    next();
  } catch (err: any) {
    next(err);
  }
};
