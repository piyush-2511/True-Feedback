import {z} from "zod";

export const SignInSchema = z.object({
  identifier: z.string().min(1, {message: "Username or email is required"}),
  password: z.string().min(1, {message: "Password is required"})
})
