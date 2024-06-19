import UserModel from "../Models/UserModel";
import { Request, Response } from "express";
import createToken from "../util/createToken";
import emailValidation from "../util/emailValidation";

const bcrypt = require("bcrypt");

// Define signup controller
export const Signup = async (req: Request, res: Response) => {
  try {
    // Get payload data
    const { username, email, password, confirmation } = req.body;

    // Validate payload data
    if (!username || !email || !password || !confirmation) {
      return res.json({ message: "All fields are required." });
    }
    if (!emailValidation(email)) {
      return res.json({ message: "Invalid email address." });
    }
    if (password !== confirmation) {
      return res.json({ message: "Passwords do not match." });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.json({
        message: "User already exists with this email or username.",
      });
    }

    // Create new user
    const user = await UserModel.create({ username, email, password });

    // Generate jwt token
    const token = createToken(user._id);

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: false,
    });

    res.status(201).json({
      message: "You have signed up successfully.",
      success: true,
      user,
    });
  } catch (e) {
    console.error(e);
  }
};

// Define login controller
export const Login = async (req: Request, res: Response) => {
  try {
    // Get payload data
    const { email, password } = req.body;

    // Validate email
    if (!emailValidation(email)) {
      return res.json({ message: "Invalid email or password." });
    }
    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ message: "Invalid email or password." });
    }

    // Compare passwords
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = createToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: false,
    });

    res.status(200).json({
      message: "You have logged in successfully.",
      success: true,
    });
  } catch (e) {
    console.error(e);
  }
};
