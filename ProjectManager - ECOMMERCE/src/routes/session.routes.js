import { Router } from "express";
import userDao from "../dao/mongoDao/user.dao.js";

const router = Router();

const register_User = async (req, resp) => {
  try {
    const userData = req.body;
    const newUser = await userDao.crear(userData);
    if (!newUser) {
      resp
        .status(400)
        .json({ status: "error", payload: "No se pudo crear el Usuario." });
    } else {
      resp.status(201).json({ status: "success", payload: userData });
    }
  } catch (error) {
    console.log(error);
    resp
      .status(500)
      .json({ status: "error", payload: "Error en el servidor." });
  }
};

const login_User = async (req, resp) => {
  try {
    const { email, password } = req.body;
    console.log(email);

    // Verificar que el user sea ADMIN:
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.session.user = {
        email,
        role: "admin",
      };
      return resp
        .status(200)
        .json({ status: "success", payload: req.session.user });
    }
    // Si no es ADMIN:
    const user = await userDao.obtenerPorEmail(email);

    if (!user || user.password !== password) {
      return resp.status(401).json({
        status: "error",
        payload: "El email o password no son validos.",
      });
    }

    // Sesion para usuarios NO-ADMIN:
    req.session.user = {
      email,
      role: user,
    };

    resp.status(200).json({ status: "success", payload: req.session.user });
  } catch (error) {
    console.log(error);
    resp
      .status(500)
      .json({ status: "error", payload: "Error en el servidor." });
  }
};

const logout_User = async (req, resp) => {
  try {
    req.session.destroy();
    // if (req.session.destroy) {
    resp
      .status(200)
      .json({ status: "sucess", payload: "Sesion cerrada con exito." });
    // }
  } catch (error) {
    console.log(error);
    resp
      .status(500)
      .json({ status: "error", payload: "Error en el servidor." });
  }
};

router.post("/register", register_User);
router.post("/login", login_User);
router.get("/logout", logout_User);

export default router;
