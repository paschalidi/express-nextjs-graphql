import { Arg, Mutation, Resolver } from "type-graphql";
import { sendEmail } from "../../utils/sendMail";
import { createForgotPasswordUrl } from "../../utils/createForgotPasswordUrl";
import { User } from "../../entity/User";

@Resolver()
export class ForgotPasswordResolver {
  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return true;
    }

    await sendEmail(email, await createForgotPasswordUrl(user.id));

    return true;
  }
}
