import createUser from "../services/userServices/user.create.js";
import loginUser from "../services/userServices/user.login.js";
import logoutUser from "../services/userServices/user.logout.js";
import {
  updateUser,
  updateAddress,
} from "../services/userServices/user.update.js";
import changePassword from "../services/userServices/user.changePassword.js";
import createQuerry from "../services/userServices/createUser.queries.js";
import getAllQurries from "../services/userServices/getAllQurries.js";
import deleteInquiry from "../services/userServices/clearConversation.js";
import cartService from "../services/userServices/user.cartService.js";
import orderService from "../services/userServices/deliveryAddress .js";
// Helper function to format user data
const formatUserResponse = (user, tokens = null) => {
  const responseData = {
    success: true,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        phone: user.phone,
      },
    },
    message: "Operation successful",
  };

  if (tokens) {
    responseData.data.tokens = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  return responseData;
};

const formatedInquiryResponse = (inquiry, user) => {
  const queryResponses = inquiry.query.map((q, index) => ({
    query: q,
    response: inquiry.response[index] || null,
    answered: !!inquiry.response[index],
  }));

  return {
    success: true,
    data: {
      inquiry: {
        _id: inquiry._id,
        queryResponses,
        status: inquiry.status,
        answeredBy: inquiry.answeredBy,
        email: user.email,
        userId: user._id,
        createdAt: inquiry.createdAt,
        pendingQueries: inquiry.response.filter((r) => !r).length,
      },
    },
    message: "Operation successful",
  };
};

const formatedOrdersResponse = (orders) => {
  const formattedOrders = orders.map((order) => ({
    orderId: order._id,
    products: order.products.map((product) => ({
      productId: product.productId._id,
      name: product.productId.name,
      quantity: product.quantity,
      price: product.productId.price,
    })),
    address: order.address,
    totalPrice: order.totalPrice,
    status: order.status,
    createdAt: order.createdAt,
  }));

  return {
    success: true,
    data: {
      orders: formattedOrders,
    },
  };
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await createUser({ name, email, password });
    res.status(201).json(formatUserResponse(user));
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const login = async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  };
  try {
    const { email, password } = req.body;
    const { loogedInUser, accessToken, refreshToken } = await loginUser({
      email,
      password,
    });

    // Set cookies
    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", refreshToken, options);

    // Send response
    return res
      .status(200)
      .json(formatUserResponse(loogedInUser, { accessToken, refreshToken }));
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(formatUserResponse(user));
    // console.log(formatUserResponse(user));
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const logout = async (req, res) => {
  try {
    await logoutUser(req, res);
    const options = {
      httpOnly: true,
      secure: true,
    };

    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(formatUserResponse(user));
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { name, email, password, phone, role } = req.body;
    // console.log(req.body);

    const updatedUser = await updateUser(user._id, {
      name,
      email,
      password,
      phone,
      role,
    });
    res.status(200).json(formatUserResponse(updatedUser));
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const updatedAddress = async (req, res) => {
  try {
    const user = req.user;
    const { address } = req.body;
    console.log(address);
    const updatedAddress = await updateAddress(user._id, address);
    res.status(200).json(formatUserResponse(updatedAddress));
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const user = req.user;
    const { currentPassword, newPassword } = req.body;
    console.log(req.body);

    console.log(currentPassword, newPassword);

    const updatedUser = await changePassword(
      user._id,
      currentPassword,
      newPassword
    );
    res.status(200).json(formatUserResponse(updatedUser));
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
    console.log(err);
  }
};

const makeQuerry = async (req, res) => {
  try {
    const { query } = req.body;
    const user = req.user;

    // Validate query
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Query cannot be empty",
      });
    }

    // Add new query to user's existing inquiry document
    const updatedInquiry = await createQuerry(user._id, query, user.email);

    res.status(201).json(formatedInquiryResponse(updatedInquiry, user));
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const getQuerriesResponse = async (req, res) => {
  try {
    const user = req.user;
    const inquiries = await getAllQurries(user._id);
    console.log(inquiries);

    res.status(200).json(inquiries);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const clearConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const clear = await deleteInquiry(id);
    res.status(200).json({
      success: true,
      message: "Conversation cleared successfully",
      data: clear,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

const getCartByUserId = async (req, res) => {
  try {
    const userId = req.user._id;
    // console.log(userId);

    const cart = await cartService.getCartByUserId(userId);
    // console.log(cart);

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(userId, productId, quantity);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error.message });
  }
};
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;
    const cart = await cartService.removeFromCart(userId, productId);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { quantity, productId } = req.body;
    console.log(req.body, userId);

    // const productID =req.params
    const cart = await cartService.updateCart(userId, productId, quantity);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await cartService.clearCart(userId);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const order = async (req, res) => {
  try {
    const userId = req.user._id;
    const orderData = req.body;
    console.log("Order data:", orderData);

    // Create the order with all address data
    const newOrder = await orderService.createOrder(userId, orderData);

    res.status(200).json({
      success: true,
      order: newOrder,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    const orders = await orderService.getOrdersByUserId(req.user._id);
    console.log(orders);
    res.send(formatedOrdersResponse(orders));
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id;
    console.log(orderId, userId);
    

    // Call the cancelOrder function from orderService
    const canceledOrder = await orderService.cancelorder(userId, orderId);

    res.status(200).json({
      success: true,
      message: "Order canceled successfully",
      data: canceledOrder,
    });
  } catch (error) {
    console.error("Error canceling order:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export {
  registerUser,
  login,
  getUserProfile,
  logout,
  updateProfile,
  updatedAddress,
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
  cancelOrder,
};
