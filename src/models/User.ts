import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document{
  content:string;
  createdAt : Date
}

const MessageSchema: Schema<Message> = new Schema({
  content : {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
})

export interface User extends Document{
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage : boolean;
  messages : Message[]
}

const UserSchema: Schema<User> = new Schema({
  username:{
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true
  },
  email:{
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, "Email is invalid"]
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  verifyCode: {
    type: String,
    required: true
  },
  verifyCodeExpiry: {
    type: Date,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true
  },
  messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);
// first - if created User Model get and fetch that (as mongoose.Model<User> is TypeScript) else create new model and fetch that (as mongoose.model<User>("User", UserSchema))
// second - if not created User Model, create and fetch that

export default UserModel;
