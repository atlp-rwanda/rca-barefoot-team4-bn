import { Prisma } from "@prisma/client";
import {
  type CookieOptions,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import config from "config";
import bcrypt from "bcryptjs";

import { LoginUserInput, type RegisterUserInput } from "../models/user.model";
import {
  registerUser,
  findUniqueUser,
  signTokens,
  deleteUsers,
} from "../services/user.service";
import { signJwt, verifyJwt } from "../utils/jwt";

const cookiesOtions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
};

if (process.env.NODE_ENV === "production") cookiesOtions.secure = true;

const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOtions,
  expires: new Date(Date.now() + 15 * 60 * 1000),
  maxAge: config.get<number>("accessTokenExpiresIn") * 60 * 1000,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOtions,
  expires: new Date(
    Date.now() + config.get<number>("refreshTokenExpiresIn") * 60 * 1000
  ),
  maxAge: 60 * 60 * 1000,
};

export const registerUserHandler = async (
  req: Request<{}, {}, RegisterUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const { firstName, lastName, email } = req.body;

    console.log("creating");

    const user = await registerUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    if (!user) {
      console.log("impossibility");
    }

    // const { access_token, refresh_token } = await signTokens(user);
    // res.cookie("access_token", access_token, accessTokenCookieOptions);
    // res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
    // res.cookie("logged_in", true, {
    //   ...accessTokenCookieOptions,
    //   httpOnly: false,
    // });

    res.status(201).json({
      status: "success",
      data: {
        user,
        // access_token,
        // refresh_token,
      },
    });
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(409).json({
          status: "fail",
          message: "Email already exist, please use another email address",
        });
      }
      next(err);
    }
  }
};

export const deleteHandler = async (
  req: Request<{}, {}>,
  res: Response,
  next: NextFunction
) => {
  deleteUsers();

  res.status(200).send("Done!");
};

// Login handler here
