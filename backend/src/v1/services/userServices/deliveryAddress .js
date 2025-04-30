import Order from "../../models/order.Model.js";

const orderService = {
    async createOrder(userId, orderData) {
        try {
            // Validate inputs
            if (!userId || !orderData.address) {
                throw new Error("User ID and address are required");
            }

            // Map the client-side address format to the database schema format
            const addressMapping = {
                houseNo: orderData.address.flatBuilding,
                street: orderData.address.landmark,
                locality: orderData.address.area,
                city: orderData.address.city,
                pinCode: orderData.address.zipcode,
                state: orderData.address.state
            };

            // Process products from orderItems field (not products)
            let totalPrice = orderData.orderTotal || 0;
            let products = [];

            // Check if orderItems array exists and process it
            if (orderData.orderItems && Array.isArray(orderData.orderItems)) {
                products = orderData.orderItems.map(item => {
                    return {
                        productId: item.productId,
                        quantity: item.quantity || 1
                    };
                });
            }
            
            // Create new order with properly mapped address and products
            const order = new Order({
                userId,
                products: products,
                address: addressMapping,
                mobile: orderData.address.mobile,
                alternateMobile: orderData.address.altMobile || "",
                paymentMethod: orderData.paymentMethod === 'cod' ? 'COD' : 'Online',
                status: "Pending",
                totalPrice: totalPrice,
                customerName: orderData.address.name || ""
            });
        
            await order.save();
            return order;
        } catch (error) {
            throw new Error("Error creating order: " + error.message);
        }
    },
    
    async getOrdersByUserId(userId) {
        try {
            // Remove the incorrect population of 'name' field
            const orders = await Order.find({ userId })
                .populate("products.productId")  // Only populate valid paths
                .exec();
                console.log(orders);
                
            return orders || [];
        } catch (error) {
            throw new Error("Error fetching orders: " + error.message);
        }
    },

    async orderAddress(userId, orderId, addressData) {
        try {
            // Validate inputs
            if (!userId || !orderId) {
                throw new Error("User ID and Order ID are required");
            }
        
            // Find the order by userId and orderId
            const order = await Order.findOne({ 
                userId, 
                _id: orderId 
            });
        
            if (!order) {
                throw new Error("Order not found");
            }
        
            // Update the address
            order.address = {
                houseNo: addressData.flatBuilding,
                street: addressData.landmark,
                locality: addressData.area,
                city: addressData.city,
                pinCode: addressData.zipcode,
                state: addressData.state
            };
            
            // Update mobile numbers and customer name
            order.mobile = addressData.mobile;
            if (addressData.altMobile) {
                order.alternateMobile = addressData.altMobile;
            }
            
            // Update customer name if provided
            if (addressData.name) {
                order.customerName = addressData.name;
            }
        
            await order.save();
            return order;
        } catch (error) {
            throw new Error("Error updating order address: " + error.message);
        }
    },

    async cancelorder(userId, orderId) {
        try {
            // Validate inputs
            if (!userId || !orderId) {
                throw new Error("User ID and Order ID are required");
            }
        
            // Find the order by userId and orderId
            const order = await Order.findOne({ 
                userId, 
                _id: orderId 
            });
            console.log(order);
            
        
            if (!order) {
                throw new Error("Order not found");
            }
        
            // Update the status to "Cancelled"
            order.status = "Cancelled";
            order.products = []
        
            await order.save();
            return order;
        } catch (error) {
            throw new Error("Error cancelling order: " + error.message);
        }
    }
}

export default orderService;