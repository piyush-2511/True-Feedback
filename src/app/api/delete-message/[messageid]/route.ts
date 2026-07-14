import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import {User} from 'next-auth'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ messageid: string }> }
) {
  const { messageid: messageId } = await params
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

  try {
    const updateResult = await UserModel.updateOne(
      {_id : user._id},
      {$pull : {messages: {_id: messageId}}}
    )

    if (updateResult.modifiedCount == 0 ){
      return Response.json({
        success: false ,
        message : "Message not found or already deleted"
      },
    {status : 401}
    )
    }

    return Response.json({
      success: true ,
      message : "Message Deleted"
    },
  {status : 200}
  )
  } catch (error) {
    console.error("Error in deleting message route", error)
    return Response.json({
      success: false ,
      message : "Error Deleting Message"
    },
  {status : 500}
  )
  }
}