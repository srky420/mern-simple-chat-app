import { Schema, model } from "mongoose";
import { createAvatar } from "@dicebear/core";
import { bottts } from "@dicebear/collection";
import axios from "axios";

const bcrypt = require("bcrypt");

// User Interface
interface IUser {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  createdtime: Date;
}

// Define User schema
const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxLength: 255,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  createdtime: {
    type: Date,
    default: Date.now(),
  },
});

// Pre-save password hash
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

// Define User model
const UserModel = model("User", userSchema);
export default UserModel;
