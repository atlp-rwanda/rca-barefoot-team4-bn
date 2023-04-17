import { Prisma } from "@prisma/client";
import {
  type CookieOptions,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import config from "config";
import bcrypt from "bcryptjs";

import {
  type LoginUserInput,
  type RegisterUserInput,
} from "../models/user.model";
import {
  registerUser,
  findUniqueUser,
  signTokens,
  requestForgotPassword,
  findUniqueResetPassword,
  updateUser,
  updateResetPassword,
  deleteUsers,
  deleteToken,
  saveToken,
} from "../services/user.service";
import { randomBytes } from "crypto";
import { sendEmail } from "../utils/mailer";
import {
  validateResetPasswordInput,
  validateUserInput,
} from "../utils/validation/validate.user";

const cookiesOtions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
};

if (process.env.NODE_ENV === "production") cookiesOtions.secure = true;

const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOtions,
  expires: new Date(Date.now() + 60 * 60 * 1000),
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
  req: Request<unknown, unknown, RegisterUserInput>,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> => {
  try {
    // validate request body
    const { error } = validateUserInput(req.body);
    if (error != null)
      return res.status(400).send({
        status: "fail",
        message: error.details[0].message,
      });
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const { firstName, lastName, email } = req.body;

    const user = await registerUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = signTokens(user);
    res.cookie("access_token", accessToken, accessTokenCookieOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // const access_token = signToken(user.id);

    res.status(201).json({
      status: "success",
      data: {
        user,
        access_token: accessToken,
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
  req: Request<unknown, unknown, LoginUserInput>,
  res: Response,
  next: NextFunction
): Promise<Response<any, Record<string, any>> | undefined> => {
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
    const { accessToken, refreshToken } = signTokens(user);
    res.cookie("access_token", accessToken, accessTokenCookieOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // save user token
    await saveToken(user.id, accessToken);
    res.status(200).json({
      status: "success",
      accessToken,
    });
  } catch (error: any) {
    next(error);
  }
};

export const forgotPasswordHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    console.log(email);
    if (email === undefined) {
      res.status(400).send({
        status: "fail",
        message: "Email is required",
      });
      return;
    }

    const user = await findUniqueUser({ email: email.toLowerCase() });
    if (user === null) {
      res.status(404).send({
        status: "fail",
        message: "User not found",
      });
      console.log("User not found");
      return;
    }

    // generate a crypto token
    const resetToken = randomBytes(32).toString("hex");
    await requestForgotPassword(user.id, resetToken);

    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      message: `<p>We have received a request to reset your password for the Barefoot Normad app. If you did not make this request, please ignore this email. Otherwise, please click on the link below to create a new password:</p>
      <div style="text-align:center;margin-bottom:16px;margin-top:16px">
      <a style="background-color:blue;border-radius:8px;padding:12px 24px;text-decoration:none;color:white" href="http://localhost:3000/reset-password/${resetToken}">Reset Password</a>
      </div>
      <p>This link will expire in 24 hours. For security reasons, do not share this link with anyone.<br>If you have any questions, please contact us by replying to this email.</p>
      <p>Thanks,<br>The Barefoot Normad Team</p>`,
    });

    res.send({
      status: "success",
      message: "Password reset link sent to your email",
    });
  } catch (error: any) {
    res.status(500).send({
      status: "fail",
      message: "Something went wrong",
    });
  }
};

export const resetPasswordHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error } = validateResetPasswordInput(req.body);
    if (error != null) {
      res.status(400).send({
        status: "fail",
        message: error.details[0].message,
      });
      return;
    }

    const reset = await findUniqueResetPassword({
      token: req.body.token,
    });

    if (reset === null || reset.isUsed || reset.expiresAt < new Date()) {
      res.status(400).send({
        status: "fail",
        message: "Invalid or expired token",
      });
      return;
    }
    await updateUser(
      { id: reset.userId },
      { password: await bcrypt.hash(req.body.password, 10) }
    );
    await updateResetPassword({ token: reset.token }, { isUsed: true });

    res.send({
      status: "success",
      message: "Password reset successful",
    });
    // send email to user
    await sendEmail({
      to: reset.user.email,
      subject: "Password reset successful",
      message: `<p>Your password has been successfully reset. If you did not make this request, please contact us immediately.</p>
      <p>Thanks,<br>The Barefoot Normad Team</p>`,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).send({
      status: "fail",
      message: "Something went wrong",
    });
  }
};

export const deleteUsersHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  await deleteUsers();

  res.status(200).send("Done!");
};

// Logout handler here

export const logout = async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.token as string;
  await deleteToken(token);

  res.status(200).send({
    status: "success",
    message: "Logged out successfully!",
  });
};
