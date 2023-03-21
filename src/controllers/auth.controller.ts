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

    const user = await registerUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const { access_token, refresh_token } = await signTokens(user);
    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // const access_token = signToken(user.id);

    res.status(201).json({
      status: "success",
      data: {
        user,
        access_token,
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

// LOGIN HANDLER
export const loginHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await findUniqueUser(
      { email: email.toLowerCase() },
      { id: true, firstName: true, lastName: true, email: true, password: true }
    );

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!user || !(await bcrypt.compare(password, user.password))) {
      next(new Error("Invalid email or password"));
      return;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { access_token, refresh_token } = await signTokens(user);
    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    res.status(200).json({
      status: "success",
      access_token,
    });
  } catch (error: any) {
    next(error);
  }
};

export const deleteHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  await deleteUsers();

  res.status(200).send("Done!");
};

// Login handler here