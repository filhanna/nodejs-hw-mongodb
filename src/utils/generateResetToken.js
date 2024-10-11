import jwt from "jsonwebtoken";
import { env } from "../utils/env.js";

const secretKey = env("JWT_SECRET");
export const generateResetToken = (email) => {
  return jwt.sign({ email }, secretKey, { expiresIn: "5m" });
};
