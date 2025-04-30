import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Medicines",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
        },
    ],
    address: {
        houseNo: {
            type: String,
            trim: true,
            lowercase: true,
        },
        street: {
            type: String,
            trim: true,
            lowercase: true,
        },
        locality: {
            type: String,
            trim: true,
            lowercase: true,
        },
        city: {
            type: String,
            trim: true,
            lowercase: true,
        },
        pinCode: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
            lowercase: true,
        },
    },
    paymentMethod: {
        type: String,
        enum: ["COD", "Online"],
        default: "COD",
    },
    status: {
        type: String,
        enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
    },
    mobile: {
        type: String,
        required: true,
    },
    alternateMobile: {
        type: String,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    deliveryDate: {
        type: Date,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;