import { Router } from "express";

import * as authControllers from "../controllers/auth.js";

import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";

import {
  userSignupSchema,
  userSigninSchema,
  userResetPasswordSchema,
  userSendEmailResetPasswordSchema,
} from "../validation/users.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validateBody(userSignupSchema),
  ctrlWrapper(authControllers.signupController)
);

authRouter.post(
  "/login",
  validateBody(userSigninSchema),
  ctrlWrapper(authControllers.signinController)
);

authRouter.post("/refresh", ctrlWrapper(authControllers.refreshController));

authRouter.post("/logout", ctrlWrapper(authControllers.signoutController));

authRouter.post(
  "/send-reset-email",
  validateBody(userSendEmailResetPasswordSchema),
  ctrlWrapper(authControllers.sendEmailtoResetPasswordController)
);

authRouter.post(
  "/reset-pwd",
  validateBody(userResetPasswordSchema),
  ctrlWrapper(authControllers.signinController)
);

export default authRouter;
