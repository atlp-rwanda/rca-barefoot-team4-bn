import jwt, { type SignOptions } from "jsonwebtoken";
import config from "config";

export const signJwt = (
  payload: object,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options: SignOptions
): string => {
  return jwt.sign(payload, config.get<string>("accessTokenPrivateKey"), {
    ...options,
  });
};

export const verifyJwt = <T>(
  token: string,
  keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
): T | null => {
  try {
    const decoded = jwt.verify(
      token,
      config.get<string>("accessTokenPrivateKey")
    ) as T;

    return decoded;
  } catch (error) {
    return null;
  }
};
