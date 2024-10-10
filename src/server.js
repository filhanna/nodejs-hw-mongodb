import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./utils/env.js";

import notFoundHeandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";
import logger from "./middlewares/logger.js";

import authRouter from "./routers/auth.js";
import contactsRouter from "./routers/contacts.js";

export const startServer = () => {
  const app = express();

  app.use(logger);
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.use("/auth", authRouter);
  app.use("/contacts", contactsRouter);

  app.use(notFoundHeandler);

  app.use(errorHandler);

  const port = Number(env("PORT", 3000));

  app.listen(port, () => console.log("Server running on port 3000"));
};
