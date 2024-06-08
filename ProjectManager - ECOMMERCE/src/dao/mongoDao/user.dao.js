import { userModel } from "../models/user.model.js";

// const obtenerTodo = async (query, options) => {
//   const users = await userModel.find(query, options);
//   return users;
// };

const obtenerPorEmail = async (email) => {
  const user = await userModel.findOne({ email }).catch((error) => {
    return null;
  });
  return user;
};

const crear = async (data) => {
  const newuser = await userModel.create(data);
  return newuser;
};

export default {
  obtenerPorEmail,
  crear,
};
