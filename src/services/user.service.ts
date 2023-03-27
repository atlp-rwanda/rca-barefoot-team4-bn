import { PrismaClient, type Prisma, type User } from "@prisma/client";
import config from "config";
import redisClient from "../utils/connectRedis";
import { signJwt } from "../utils/jwt";

export const excludedFields: string[] = [
  "password",
  "verified",
  "verificationCode",
];

const prisma = new PrismaClient();

export const registerUser = async (input: Prisma.UserCreateInput) => {
  return await prisma.user.create({
    data: input,
  });
};

export const findUniqueUser = async (
  where: Prisma.UserWhereUniqueInput,
  select?: Prisma.UserSelect
) => {
  return (await prisma.user.findUnique({
    where,
    select,
  })) as User;
};

export const signTokens = async (user: Prisma.UserCreateInput) => {
  // 1. Create Session
  // redisClient.set(`${user.id}`, JSON.stringify(user), {
  //   EX: config.get<number>('redisCacheExpiresIn') * 60,
  // });

  // 2. Create Access and Refresh tokens

  const access_token = signJwt({ id: user.id }, "accessTokenPrivateKey", {
    expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
  });

  const refresh_token = signJwt({ id: user.id }, "refreshTokenPrivateKey", {
    expiresIn: `${config.get<number>("refreshTokenExpiresIn")}m`,
  });

  return { access_token, refresh_token };
};

export const deleteUsers = async () => {
  console.log("deleting...");
  await prisma.user.deleteMany();
};

export const deleteToken =async (token:string) => {
  await prisma.token.delete({
    where:{
      token_value:token
    }
  })
}

export const checkTokenExist =async (token:string) => {
  return await prisma.token.findFirst({
    where:{
      token_value:token
    }
  })
}

export const getOne =async (id:string) => {
  return await prisma.user.findFirst({
    where:{
      id
    }
  })
}