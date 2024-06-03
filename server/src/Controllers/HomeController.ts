import { Request, Response } from "express";
import UserModel from "../Models/UserModel";

export const Home = async (req: Request, res: Response) => {
  // Get payload data
  const userId = req.userId;

  // Fetch user doc
  const user = await UserModel.findById(userId, '-_id -password');
  if (!user) {
    return res.json({ status: false });
  }

  res.json({ status: true, user });
};