import { request, response } from "express";

export const isLogin = async (req = request, resp = response, next) => {
  if (req.session.user) {
    next();
  } else {
    resp.status(401).json({ status: "error", payload: "Usuario no loggeado." });
  }
};
