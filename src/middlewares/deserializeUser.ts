import { type Request, type Response, type NextFunction } from "express";
import { omit } from "lodash";
import { excludedFields, findUniqueUser } from "../services/user.service";
import { verifyJwt } from "../utils/jwt";

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> => {
  try {
    let accessToken: string = "";

    if (
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      req.headers?.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      accessToken = req.headers.authorization.split(" ")[1];
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    } else if (req.cookies?.access_token) {
      accessToken = req.cookies?.access_token;
    }

    if (accessToken === "") {
      next(new Error("You are not logged in."));
      return;
    }

    const decoded = verifyJwt<{ userId: string }>(
      accessToken,
      "accessTokenPrivateKey"
    );

    if (decoded === null) {
      next(new Error("Invalid token or user doesn't exist"));
      return;
    }

    // Check if the user still exist
    const user = await findUniqueUser(
      { id: decoded?.userId },
      { id: true, firstName: true, lastName: true, email: true, role: true }
    );

    if (user === null) {
      next(new Error(`Invalid token or session has expired`));
      return;
    }

    res.locals.user = omit(user, excludedFields);

    next();
  } catch (err: any) {
    next(err);
  }
};
