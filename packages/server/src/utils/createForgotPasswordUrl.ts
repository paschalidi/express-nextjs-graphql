import { redis } from "../redis";
import v4 from "uuid/v4";
import { forgotPasswordPrefix } from "../modules/constants/redisPrefixes";

export const createForgotPasswordUrl = async (userId: number) => {
  const token = v4();
  await redis.set(forgotPasswordPrefix + token, userId, "ex", 60 * 60 * 24); // one day expiration;
  return `http://localhost:3000/user/change-password/${token}`;
};
