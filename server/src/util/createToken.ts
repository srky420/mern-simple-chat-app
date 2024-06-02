import { Types } from "mongoose";
import { configDotenv } from "dotenv";
import { sign } from "jsonwebtoken";

configDotenv();

const TOKEN_KEY: any = process.env.TOKEN_KEY;

// Generate jwt token
export default function createToken(id: Types.ObjectId) {
  return sign({ id }, TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60
  });
}