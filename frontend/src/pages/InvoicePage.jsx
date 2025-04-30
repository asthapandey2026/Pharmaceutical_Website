import React from "react";
import { useParams } from "react-router-dom";

const InvoicePage = () => {
  const { orderId } = useParams();

  // Sample order details 
  const orderDetails = {
    id: orderId,
    customer: "John Doe",
    email: "johndoe@example.com",
    phone: "+91 9876543210",
    address: "123, Green Street, New Delhi, India",
    orderDate: "2025-03-15",
    shippedBy: "Pharmaceuticals",
    paymentMethod: "Prepaid",
    customerCare: "+91 1800-123-456",
    items: [
      { name: "Wireless Earbuds", price: 2500 },
      { name: "Smart Watch", price: 5000 },
      { name: "Phone Case", price: 700 },
    ],
  };

  const totalAmount = orderDetails.items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen mt-10 bg-gray-100 p-8 flex justify-center">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">Invoice</h1>

        <div className="border p-4 rounded-md">
          <p className="text-lg font-semibold">Order ID: {orderDetails.id}</p>
          <p>Invoice Date: {orderDetails.orderDate}</p>
          <p>Shipped by: <strong>{orderDetails.shippedBy}</strong></p>
        </div>

        <div className="mt-4 border p-4 rounded-md">
          <h2 className="text-lg font-bold">Customer Details:</h2>
          <p><strong>Name:</strong> {orderDetails.customer}</p>
          <p><strong>Email:</strong> {orderDetails.email}</p>
          <p><strong>Phone:</strong> {orderDetails.phone}</p>
          <p><strong>Delivery Address:</strong> {orderDetails.address}</p>
        </div>

        <div className="mt-4 border p-4 rounded-md">
          <h2 className="text-lg font-bold">Order Summary:</h2>
          <table className="w-full border-collapse border border-gray-300 mt-2">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-left">Item</th>
                <th className="border p-2 text-right">Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.items.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2 text-right">₹{item.price}</td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-100">
                <td className="border p-2">Total Amount</td>
                <td className="border p-2 text-right">₹{totalAmount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 border p-4 rounded-md">
          <p><strong>Payment Method:</strong> {orderDetails.paymentMethod}</p>
          <p><strong>Customer Care:</strong> {orderDetails.customerCare}</p>
        </div>

      </div>
    </div>
  );
};

export default InvoicePage;
