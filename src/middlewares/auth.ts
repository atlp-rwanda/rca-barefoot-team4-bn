import { type Request, type Response, type NextFunction } from "express";
import { checkTokenExist, getOne } from "../services/user.service";
import jwt, { type JwtPayload } from "jsonwebtoken";

export const auth = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    let token = "";

    if (
      request.headers.authorization &&
      request.headers.authorization.startsWith("Bearer")
    ) {
      token = request.headers.authorization.split(" ")[1];
    } else if (request.cookies.access_token) {
      token = request.cookies.access_token;
    }

    if (!token) {
      next(new Error("You are not logged in! Please login "));
      return;
    }
    // check if user token is valid

    const userToken = await checkTokenExist(token);

    if (!userToken) {
      return response.status(401).send({
        success: false,
        message: "Unauthorized to access this service",
      });
    }

    // check token mapping

    const secretKey: string = process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY || "";
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    const user = await getOne(decoded.id);

    if (user == null) {
      return response.status(403).send({
        success: false,
        message: "Unauthorized to access this service",
      });
    }

    request.headers.id = user.id;
    request.headers.token = token;
    next();
  } catch (e: any) {
    return response.status(500).send({ success: false, message: e.message });
  }
};
