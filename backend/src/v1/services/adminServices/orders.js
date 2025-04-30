import Order from "../../models/order.Model.js";

const getAllOrders = async () => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name.firstName name.lastName email')
      .populate('products.productId', 'name price');
    console.log(orders);
    
    return orders;
  } catch (error) {
    throw new Error("Error fetching orders: " + error.message);
  }
};

const getOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId)
      .populate('userId', 'name.firstName name.lastName email')
      .populate('products.productId', 'name price');
    
    if (!order) {
      throw new Error("Order not found");
    }
    
    return order;
  } catch (error) {
    throw new Error("Error fetching order: " + error.message);
  }
};

export { getAllOrders, getOrderById };