import { type Request, type Response, type NextFunction } from "express";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user;

      if (user === null) {
        next(new Error("User does not exist"));
        return;
      }

      if (!roles.includes(res.locals.user.role)) {
        res.status(403).json({
          status: "fail",
          message: "You don't have permission to perform this action.",
        });
        return;
      }

      next();
    } catch (err: any) {
      next(err);
    }
  };
};
