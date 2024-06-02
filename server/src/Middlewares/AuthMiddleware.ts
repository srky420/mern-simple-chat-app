import { RequestHandler } from "express";
import { configDotenv } from "dotenv";
import { verify } from "jsonwebtoken";

configDotenv();

const TOKEN_KEY: any = process.env.TOKEN_KEY;

// Extend Request object property
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

// Verify jwt token from cookie
export const UserVerification: RequestHandler = async (req, res, next) => {
  // Get token from cookie
  const token = req.cookies.token;

  // If token does not exist
  if (!token) {
    return res.json({ status: false });
  }

  // Verify token
  verify(token, TOKEN_KEY, (err: any, data: any) => {
    if (err) {
      return res.json({ status: false });
    }
    req.userId = data.id;
    next();
  });
}