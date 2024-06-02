import { Schema, model } from "mongoose";

// User Interface
interface IUser {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  createdtime: Date;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    maxLength: 50
  },
  email: {
    type: String,
    required: true,
    maxLength: 255
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false
  },
  createdtime: {
    type: Date,
    default: Date.now()
  }
});

const UserModel = model('User', userSchema); 
export default UserModel;