import express from "express";
import {
  registerUser,
  login,
  getUserProfile,
  logout,
  updatedAddress,
  updateProfile,
  updatePassword,
  refreshToken,
  makeQuerry,
  getQuerriesResponse,
  clearConversation,
  getCartByUserId,
  addToCart,
  removeFromCart,
  updateCart,
  clearCart,
  order,
  getOrdersByUserId,
  cancelOrder
} from "../controllers/user.controller.js";
import {
  getMedicinesController,
  getMedicineByIdController,
} from "../controllers/admin.controller.js";
import { 
    profileValidation, 
    addressValidation, 
    passwordValidation, 
    registerUserValidation 
} from "../middleware/user.validation.js";
import authUser from "../middleware/auth.user.js";

const router = express.Router();

router.route("/register").post(registerUserValidation, registerUser);
router.route("/login").post(login);
router.route("/profile").get(authUser, getUserProfile);
router.route("/logout").post(authUser, logout);
router.route("/refreshToken").get(authUser, refreshToken);
router.route("/products").get(getMedicinesController);
router.route("/products/:id").get(getMedicineByIdController);
router.route("/updateProfile").patch(authUser, profileValidation, updateProfile);
router.route("/updateAddress").patch(authUser, addressValidation, updatedAddress);
router.route("/updatePassword").patch(authUser, passwordValidation ,updatePassword);
router.route("/makeQuerry").post(authUser, makeQuerry);
router.route("/getQuerries").get(authUser, getQuerriesResponse);
router.route("/clearConversation/:id").patch(authUser, clearConversation)
router.route("/Cart").get(authUser, getCartByUserId);
router.route("/addToCart").patch(authUser, addToCart);
router.route("/removeFromCart").patch(authUser, removeFromCart);
router.route("/updateCart").patch(authUser, updateCart);
router.route("/clearCart").post(authUser, clearCart);
router.route("/orders/create").post(authUser, order);
router.route("/orders").get(authUser, getOrdersByUserId);
router.route("/orders/:id/cancel").patch(authUser, cancelOrder );


export default router;
