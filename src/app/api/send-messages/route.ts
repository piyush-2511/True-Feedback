import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";
import { MessageSchema } from "@/Schemas/messageSchema";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  // ✅ validate content before touching the database
  const result = MessageSchema.safeParse({ content });
  if (!result.success) {
    const errorMessage = result.error.issues[0]?.message ?? "Invalid message";
    return Response.json(
      { success: false, message: errorMessage },
      { status: 400 }
    );
  }

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        { success: false, message: "User is not accepting messages" },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      { success: true, message: "Message sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json(
      { success: false, message: "Failed to send message, internal server error" },
      { status: 500 }
    );
  }
}