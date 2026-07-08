import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import {User} from 'next-auth'
import mongoose from "mongoose";

export async function GET(request: Request){
  await dbConnect();

  const session = await getServerSession(authOptions)
  const user: User = session?.user as User

  if (!session || !session.user){
    return Response.json({
      success: false,
      message: "Unauthorized"
    }, {
      status: 401
    })
  }

  const userId = new mongoose.Types.ObjectId(user._id)

  try {
    const foundUser = await UserModel.aggregate([
      { $match : {_id : userId}},
      { $unwind : '$messages'},
      { $sort : {'messages.createdAt': -1}},
      { $group : {_id: '$_id', messages: {$push : '$messages'}}}
    ])

    if (!foundUser || foundUser.length === 0 ){
      return Response.json({
        success: false,
        message: "User not found",
        messages:[]
      }, {
        status: 404
      })
    }

    console.log(foundUser[0])
    return Response.json({
      success: true,
      message: "User messages retrieved successfully",
      messages: foundUser[0].messages
    }, {
      status: 200
    })
  } catch (error) {
    console.error("Error retrieving user messages:", error);
    return Response.json({
      success: false,
      message: "Failed to retrieve user messages"
    }, {
      status: 500
    })
  }
}