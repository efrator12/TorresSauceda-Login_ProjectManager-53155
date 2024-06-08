import { Router } from "express";
import cartDao from "../dao/mongoDao/cart.dao.js";

const router = Router();

const obtainCARTS = async (req, resp) => {
  try {
    const carts = await cartDao.obtenerTodo();
    if (carts.length > 0) {
      resp.status(200).json({ status: "success", payload: carts });
    } else {
      resp.status(200).json({
        status: "success",
        payload: " No existen ningun Carrito.",
      });
    }
  } catch (error) {
    resp
      .status(404)
      .json({ status: "error", response: "Error en el servidor." });
  }
};

const obtainCARTByID = async (req, resp) => {
  try {
    const { cid } = req.params;
    const cart_byID = await cartDao.obtenerPorID(cid);
    if (cart_byID == false) {
      resp.status(200).json({
        status: "success",
        payload: `El Producto con el ID: ${cid} no fue encontrado o ya fue eliminado`,
      });
    } else {
      resp.status(200).json({ status: "success", payload: cart_byID });
    }
  } catch (error) {
    resp
      .status(404)
      .json({ status: "error", response: "Error en el servidor." });
  }
};

const createCART = async (req, resp) => {
  try {
    const newCart = await cartDao.crear();
    resp.status(201).json({ status: "success", payload: newCart });
  } catch (error) {
    resp
      .status(404)
      .json({ status: "error", response: "No se puede crear el CART" });
  }
};

const add_Products_To_Carts = async (req, resp) => {
  try {
    const { cid, pid } = req.params;
    const newProductInCart = await cartDao.agregarProducto(cid, pid);
    resp.status(201).json({ status: "success", payload: newProductInCart });
  } catch (error) {
    resp.status(404).json({ status: "error", response: error.message });
  }
};

const delete_Products_In_Carts = async (req, resp) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartDao.eliminarProductoEnCarro(cid, pid);

    if (cart === false) {
      throw Error();
    } else {
      resp.status(201).json({
        status: "success",
        payload: `Producto con el ID: ${pid} eliminado`,
      });
    }
  } catch (error) {
    resp
      .status(404)
      .json({ status: "error", response: "No se elimino ningun producto" });
  }
};

const delete_Cart = async (req, resp) => {
  try {
    const { cid } = req.params;
    console.log(cid);
    const cart = await cartDao.eliminarCarro(cid);
    if (cart == false) {
      resp.status(200).json({
        status: "success",
        response: `El Carrito con el ID: ${cid} no fue encontrado o ya fue eliminado`,
      });
    } else {
      resp.status(200).json({
        status: "success",
        payload: `Carrito con el ID: ${cid} eliminado`,
      });
    }
  } catch (error) {
    resp
      .status(404)
      .json({ status: "error", response: "Error en el servidor." });
  }
};

router.post("/", createCART);
router.get("/", obtainCARTS);
router.get("/:cid", obtainCARTByID);
router.post("/:cid/products/:pid", add_Products_To_Carts);
router.delete("/:cid/products/:pid", delete_Products_In_Carts);
router.delete("/:cid", delete_Cart);

export default router;
