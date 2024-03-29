import {
  PrismaClient,
  type Role,
  type ResetPassword,
  type Prisma,
  type User,
} from "@prisma/client";
import config from "config";
import { type Tokens } from "token";
import { signJwt } from "../utils/jwt";

export const excludedFields: string[] = [
  "password",
  "verified",
  "verificationCode",
];

const prisma = new PrismaClient();

export const registerUser = async (
  input: Prisma.UserCreateInput
): Promise<User> => {
  return await prisma.user.create({
    data: input,
  });
};

export const findUniqueUser = async (
  where: Prisma.UserWhereUniqueInput,
  select?: Prisma.UserSelect,
): Promise<User> => {
  return (await prisma.user.findUnique({
    where,
    select,
  })) as User;
};
export const signTokens = (user: Prisma.UserCreateInput): Tokens => {
  const accessToken = signJwt({ userId: user.id }, "accessTokenPrivateKey", {
    expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
  });

  const refreshToken = signJwt({ userId: user.id }, "refreshTokenPrivateKey", {
    expiresIn: `${config.get<number>("refreshTokenExpiresIn")}m`,
  });

  return { accessToken, refreshToken };
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const changeUserRole = async (userId: string, theRole: Role) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: theRole,
    },
  });

  return updatedUser;
};

export const updateUser = async (
  where: Prisma.UserWhereUniqueInput,
  data: Prisma.UserUpdateInput
): Promise<User> => {
  return await prisma.user.update({
    where,
    data,
  });
};

export const deleteUsers = async (): Promise<Prisma.BatchPayload> => {
  return await prisma.user.deleteMany();
};

export const requestForgotPassword = async (
  userId: string,
  token: string
): Promise<ResetPassword> => {
  // token expires in 15 minutes
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  return await prisma.resetPassword.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });
};

export const findUniqueResetPassword = async (
  where: Prisma.ResetPasswordWhereUniqueInput
): Promise<
  | (ResetPassword & {
      user: User;
    })
  | null
> => {
  return await prisma.resetPassword.findUnique({
    where,
    include: {
      user: true,
    },
  });
};

export const updateResetPassword = async (
  where: Prisma.ResetPasswordWhereUniqueInput,
  data: Prisma.ResetPasswordUpdateInput
): Promise<ResetPassword> => {
  return await prisma.resetPassword.update({
    where,
    data,
  });
};

export const deleteToken = async (token: string) => {
  await prisma.token.delete({
    where: {
      token_value: token,
    },
  });
};

export const deleteTokenByUserId = async (user_id: string) => {
  await prisma.token.delete({
    where: {
      user_id,
    },
  });
};

export const checkTokenExist = async (token: string) => {
  return await prisma.token.findFirst({
    where: {
      token_value: token,
    },
  });
};

export const checkTokenExistByUserId = async (user_id: string):Promise<boolean> => {
  return await prisma.token.findFirst({
    where: {
      user_id,
    },
  })?true:false;
};

export const saveToken = async (user_id: string, token: string) => {
  // first delete the old token and user record
  await checkTokenExistByUserId(user_id) &&  await deleteTokenByUserId(user_id);
  const savedToken = await prisma.token.create({
    data: {
      user_id,
      token_value: token,
    },
  });

  return savedToken;
};

export const getOne = async (id: string) => {
  return await prisma.user.findFirst({
    where: {
      id,
    },
  }) as User;
};
export const getAllUsersService = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};

export const getUserbyId = async (
  where: Prisma.UserWhereUniqueInput
): Promise<User | null> => {
  return await prisma.user.findUnique({
    where,
  });
};

export const updateUserProfileService = async (
  where: Prisma.UserWhereUniqueInput,
  data: Prisma.UserUpdateInput
): Promise<User> => {
  return await prisma.user.update({
    where,
    data,
  });
};
