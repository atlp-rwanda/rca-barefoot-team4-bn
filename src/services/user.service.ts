import { PrismaClient, type Prisma, type User } from "@prisma/client";
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
  select?: Prisma.UserSelect
): Promise<User> => {
  return (await prisma.user.findUnique({
    where,
    select,
  })) as User;
};
export const signTokens = (user: Prisma.UserCreateInput): Tokens => {
  // 1. Create Session
  // redisClient.set(`${user.id}`, JSON.stringify(user), {
  //   EX: config.get<number>('redisCacheExpiresIn') * 60,
  // });

  // 2. Create Access and Refresh tokens

  const accessToken = signJwt({ userId: user.id }, "accessTokenPrivateKey", {
    expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
  });

  const refreshToken = signJwt({ userId: user.id }, "refreshTokenPrivateKey", {
    expiresIn: `${config.get<number>("refreshTokenExpiresIn")}m`,
  });

  return { accessToken, refreshToken };
};

export const deleteUsers = async (): Promise<Prisma.BatchPayload> => {
  return await prisma.user.deleteMany();
};
