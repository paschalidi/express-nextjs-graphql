import { redis } from "../redis";
import v4 from "uuid/v4";
import { confirmationPrefix } from "../modules/constants/redisPrefixes";

export const createConfirmationUrl = async (userId: number) => {
  const token = v4();
  await redis.set(confirmationPrefix + token, userId, "ex", 60 * 60 * 24); // one day expiration;
  return `http://localhost:3000/user/confirm/${token}`;
};
