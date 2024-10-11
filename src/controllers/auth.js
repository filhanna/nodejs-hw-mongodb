import * as authServices from "../services/auth.js";

const setupSession = (res, session) => {
  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expire: new Date(Date.now() + session.refreshTokenValidUntil),
  });

  res.cookie("sessionId", session._id, {
    httpOnly: true,
    expire: new Date(Date.now() + session.refreshTokenValidUntil),
  });
};

export const signupController = async (req, res) => {
  const newUser = await authServices.signup(req.body);

  res.status(201).json({
    status: 201,
    message: "Successfully register user",
    data: newUser,
  });
};

export const signinController = async (req, res) => {
  const session = await authServices.signin(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: " Seccessfully signin",
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;
  const session = await authServices.refreshSession({
    refreshToken,
    sessionId,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: " Seccessfully refresh session",
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const signoutController = async (req, res) => {
  const { sessionId } = req.cookies;
  if (sessionId) {
    await authServices.signout(sessionId);
  }

  res.clearCookie("sessionId");
  res.clearCookie("refreshToken");

  res.status(204).send();
};

export const sendEmailtoResetPasswordController = async (req, res) => {
  await authServices.sendEmailResetPassword(req.body.email);

  res.json({
    status: 200,
    message: "Reset password email has been successfully sent.",
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await authServices.sendEmailResetPassword(req.body.email);

  res.json({
    status: 200,
    message: "Password has been successfully reset.",
    data: {},
  });
};
