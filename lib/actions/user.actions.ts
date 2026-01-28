"use server";
import { signIn, signOut } from "@/auth";
import { IUserSignIn, IUserSignUp } from "@/types";
import { redirect } from "next/navigation";
import { UserSignUpSchema } from "../validator";
import { connectToDatabase } from "..";
import User from "@/lib/db/models/user.model";
import bcrypt from "bcryptjs";
import { formatError } from "../utils";

export async function signInWithCredentials(user: IUserSignIn) {
  return await signIn("credentials", { ...user, redirect: false });
}

export async function SignInWithGoogle() {
  return await signIn("google");
}

export const SignOut = async () => {
  const redirectTo = await signOut({ redirect: false });
  redirect(redirectTo.redirect);
};

export const registerUser = async (userSignUp: IUserSignUp) => {
  try {
    const user = await UserSignUpSchema.parseAsync({
      name: userSignUp.name,
      password: userSignUp.password,
      confirmPassword: userSignUp.confirmPassword,
      email: userSignUp.email,
    });

    await connectToDatabase();
    await User.create({
      ...user,
      password: await bcrypt.hash(user.password, 5),
    });
    return { success: true, message: "User created successfully" };
  } catch (error) {
    return {
      success: true,
      error: { success: false, message: formatError(error) },
    };
  }
};
