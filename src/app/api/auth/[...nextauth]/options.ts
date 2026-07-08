  import { NextAuthOptions } from "next-auth";
  import  CredentialsProvider from "next-auth/providers/credentials";
  import bcrypt from "bcryptjs";
  import dbConnect from "@/lib/dbConnect";
  import UserModel from "@/models/User";


  export const authOptions: NextAuthOptions = {
    providers : [
      CredentialsProvider({
        id : "credentials",
        name : "Credentials",
        credentials : {
          email: {label: "Email or username", type: "text"},
          password: {label: "Password", type: "password"}
        },
        async authorize(credentials: any): Promise<any>{
          await dbConnect();
          console.log("Received credentials:", credentials);

          try {
            const user = await UserModel.findOne({
              $or: [
                { email: credentials.identifier },
                { username: credentials.identifier }
              ]
            })

            console.log("User found:", user);

            if(!user){
              throw new Error("No user found with this email");
            }

            if (!user.isVerified) {
              throw new Error("User is not verified, please verify your account first");
            }

            const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
            if (isPasswordCorrect){
              return {
                _id: user._id,
                email: user.email,
                username: user.username,
                isVerified: user.isVerified,
                isAcceptingMessage: user.isAcceptingMessage,
              }
            }else {
              throw new Error("Incorrect password");
            }
          } catch (error) {
            throw new Error((error as Error).message || "Something went wrong");
          }
        }
      })
    ],
    callbacks: {
      async session({session,token}){
        if (token){
          session.user._id = token._id;
          session.user.isVerified = token.isVerified;
          session.user.isAcceptingMessage = token.isAcceptingMessage;
          session.user.username = token.username;
        }

        return session
      },
      async jwt({token, user}){
        if (user){
          token._id = user._id?.toString()
          token.isVerified = user.isVerified;
          token.isAcceptingMessage = user.isAcceptingMessage;
          token.username = user.username;
        }

        return token
      }
    },
    pages: {
      signIn: '/sign-in',
      error: '/sign-in'
    },
    session: {
      strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
  }