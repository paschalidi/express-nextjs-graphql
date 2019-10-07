import { Arg, Mutation, Resolver } from "type-graphql";
import { User } from "../../entity/User";
import { redis } from "../../redis";
import { hash } from "bcryptjs";
import { ChangePasswordInput } from "./changePassword/ChangePasswordInput";
import { forgotPasswordPrefix } from "../constants/redisPrefixes";

@Resolver()
export class ChangePasswordResolver {
  @Mutation(() => User, { nullable: true })
  async changePassword(@Arg("data")
  {
    token,
    password
  }: ChangePasswordInput): Promise<User | null> {
    const userId = await redis.get(forgotPasswordPrefix + token);

    if (!userId) {
      return null;
    }

    const user = await User.findOne(userId);

    if (!user) {
      return null;
    }

    await User.update(
      { id: parseInt(userId, 10) },
      { password: await hash(password, 12) }
    );

    await redis.del(forgotPasswordPrefix + token);

    return user;
  }
}
