import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import {z} from "zod"

import { usernameValidation } from "@/Schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username : usernameValidation
})

export async function GET(request: Request){
  
  await dbConnect()

  try {
    const {searchParams} = new URL(request.url)
    const queryParam = {
      username : searchParams.get("username")
    }
    //validate with zod 
    const result = UsernameQuerySchema.safeParse(queryParam)
    // console.log(result)

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || []
      return Response.json({
        success : false,
        message : "Invalid username",
        errors : usernameErrors
      },{
        status: 400
      })
    } 



    const {username} = result.data

    const existingVerifiedUser = await UserModel.findOne({
      username, 
      isVerified : true
    })

    if (existingVerifiedUser){
      return Response.json({
        success : false,
        message : "Username already exists"
      },{
        status: 400
      })
    }

    return Response.json({
      success : true,
      message : "Username is unique"
    }, {status: 201})
    
  } catch (error) {
    console.error("Error checking username uniqueness:", error);
    return Response.json({
      success : false,
      message : "Internal server error"
    },{
      status: 500
    })
  }
}