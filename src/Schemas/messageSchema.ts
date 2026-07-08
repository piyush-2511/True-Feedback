import {z} from "zod";

export const MessageSchema = z.object({
  content : z
    .string()
    .min(10, {message: "Message must be at least 10 characters"})
    .max(500, {message: "Message content cannot exceed 500 characters"}),
})
