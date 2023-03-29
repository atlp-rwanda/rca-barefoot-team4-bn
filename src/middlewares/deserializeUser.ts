import { type Request, type Response, type NextFunction } from "express";
import config from "config";
import { omit } from "lodash";
import { excludedFields, findUniqueUser } from "../services/user.service";
import { verifyJwt } from "../utils/jwt";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    let access_token: string = "";

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      access_token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.access_token) {
      access_token = req.cookies.access_token;
    }

    if (!access_token) {
      next(new Error("You are not logged in."));
      return;
    }

    const decoded = verifyJwt<{ userId: string }>(
      access_token,
      "accessTokenPrivateKey"
    );

    if (!decoded) {
      next(new Error("Invalid token or user doesn't exist"));
      return;
    }

    // Check if the user still exist
    const user = await findUniqueUser({ id: decoded?.userId });

    if (!user) {
      next(new Error(`Invalid token or session has expired`));
      return;
    }

    res.locals.user = omit(user, excludedFields);

    next();
  } catch (err: any) {
    next(err);
  }
};
