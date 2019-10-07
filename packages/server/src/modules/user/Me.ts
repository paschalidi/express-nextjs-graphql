import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { MyContext } from "../../types/MyContext";
import { User } from "../../entity/User";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class MeResolver {
  @UseMiddleware(isAuth)
  @Query(() => User, { nullable: true })
  async me(@Ctx() context: MyContext): Promise<User | undefined> {
    if (!context.req.session!.userId) return undefined;

    return User.findOne(context.req.session!.userId);
  }
}
