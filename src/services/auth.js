import bcrypt from "bcrypt";

import createHttpError from "http-errors";

import { randomBytes } from "crypto";

import SessionCollection from "../db/models/Session.js";

import UserCollection from "../db/models/User.js";

import { sendResetPasswordEmail } from "./sendEmail.js";

import jwt from "jsonwebtoken";

import { env } from "../utils/env.js";

import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from "../constants/users.js";

const createSession = () => {
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");

  const accessTokenValidUntil = new Date(Date.now() + accessTokenLifetime);
  const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifetime);

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const signup = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, "Email already exist");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const data = await UserCollection.create({
    ...payload,
    password: hashPassword,
  });
  delete data._doc.password;

  return data._doc;
};

export const signin = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, "Email or password invalid");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, "Email or password invalid");
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const sessionData = createSession();

  const userSession = await SessionCollection.create({
    userId: user._id,
    ...sessionData,
  });

  return userSession;
};

export const findSessionByAccessToken = (accessToken) =>
  SessionCollection.findOne({ accessToken });

export const refreshSession = async ({ refreshToken, sessionId }) => {
  const oldSession = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!oldSession) {
    throw createHttpError(401, "Session not found");
  }

  if (new Date() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, "Session token expired");
  }

  await SessionCollection.deleteOne({ _id: sessionId });

  const sessionData = createSession();

  const userSession = await SessionCollection.create({
    userId: oldSession._id,
    ...sessionData,
  });

  return userSession;
};

export const signout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const findUser = (filter) => UserCollection.findOne(filter);

export const sendEmailResetPassword = async (email) => {
  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, `User not found!`);
  }
  try {
    await sendResetPasswordEmail(email);
  } catch (error) {
    console.error(error);
    throw createHttpError(
      500,
      `Failed to send the email, please try again later.`
    );
  }
};

export const resetPasswordService = async (password, token) => {
  const secretKey = env("JWT_SECRET");
  try {
    const decodedToken = jwt.verify(token, secretKey);
    const email = decodedToken.email;
    const user = await UserCollection.findOne({ email });
    if (!user) {
      throw createHttpError(404, `User not found!`);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("password:", password);
    console.log("user.password:", user.password);
    console.log("hashedPassword:", hashedPassword);
    user.password = hashedPassword;
    user.save();

    await SessionCollection.deleteOne({ _id: user._id });
  } catch (error) {
    console.error(error.name);
    console.log(
      error.name === "TokenExpiredError" || error.name === "JsonWebTokenError"
    );
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      throw createHttpError(401, "Token is expired or invalid.");
    }
  }
};
