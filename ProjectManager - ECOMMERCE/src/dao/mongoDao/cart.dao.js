import { cartModel } from "../models/cart.model.js";
import { productModel } from "../models/product.model.js";

const obtenerTodo = async () => {
  const carts = await cartModel.find();
  return carts;
};

const obtenerPorID = async (cid) => {
  const cart = await cartModel.findById(cid).catch((error) => {
    let cart_helper = false;
    return cart_helper;
  });
  return cart;
};

const crear = async (data) => {
  const newcart = await cartModel.create(data);
  return newcart;
};

const agregarProducto = async (cid, pid) => {
  await productModel.findById(pid).catch((error) => {
    throw new Error(
      `El Producto con el ID: ${pid} no fue encontrado o ya fue eliminado`
    );
  });

  await cartModel.findById(cid).catch((error) => {
    throw new Error(
      `El Carrito con el ID: ${cid} no fue encontrado o ya fue eliminado`
    );
  });

  const productInCART = await cartModel.findOneAndUpdate(
    {
      _id: cid,
      "products.product": pid,
    },
    { $inc: { "products.$.quantity": 1 } }
  );

  if (!productInCART) {
    await cartModel.findOneAndUpdate({
      _id: cid,
      $push: { products: { product: pid, quantity: 1 } },
    });
  }
  const cart = await cartModel.findById(cid);
  return cart;
};

const eliminarProductoEnCarro = async (cid, pid) => {
  await productModel.findById(pid).catch((error) => {
    throw new Error(
      `El Producto con el ID: ${pid} no fue encontrado o ya fue eliminado`
    );
  });

  await cartModel.findById(cid).catch((error) => {
    throw new Error(
      `El Carrito con el ID: ${cid} no fue encontrado o ya fue eliminado`
    );
  });

  const eliminatePIDinCID = await cartModel.findOneAndUpdate(
    {
      _id: cid,
      "products.product": pid,
    },
    { $inc: { "products.$.quantity": -1 } }
  );

  let cart = true;

  if (!eliminatePIDinCID) {
    let cart = false;
  }

  return cart;
};

const eliminarCarro = async (cid) => {
  let cart;
  const cartFound = await cartModel.findById(cid).catch((error) => {
    cart = false;
    return cart;
  });
  console.log(cartFound);
  if (!cartFound) {
    cart = false;
    return cart;
  } else {
    const cartDeleted = await cartModel.findByIdAndDelete({ _id: cid });
    console.log(cartDeleted);
    if (!cartDeleted) {
      let cart = false;
    }
    console.log("Dentro", cart);
    return cart;
  }
};

export default {
  obtenerTodo,
  obtenerPorID,
  crear,
  agregarProducto,
  eliminarProductoEnCarro,
  eliminarCarro,
};
