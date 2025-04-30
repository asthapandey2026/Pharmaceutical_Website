import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderSummary = () => {
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState("Credit Card");
    const [isProcessing, setIsProcessing] = useState(false);

    // Sample Ordered Items (You can replace it with actual data)
    const orderedItems = [
        { id: 1, name: "DermaCo Face Wash", price: "₹999" },
        { id: 2, name: "Lotus sunscreen", price: "₹499" },
        { id: 3, name: "DermaCo SunScreen SPF 50", price: "₹499" },
    ];

    const handlePayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            const success = Math.random() > 0.2; // 80% success rate
            if (success) {
                navigate("/processPayment");
            } else {
                navigate("/payment-failure");
            }
        }, 2000);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-100 p-6 space-y-6 md:space-y-0 md:space-x-6">
            {/* Order Summary Section */}
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg h-[450px] flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
                
                {/* Order Details */}
                <div className="text-gray-700 space-y-2 flex-grow">
                    <p>Order ID: <span className="font-semibold">#12345</span></p>
                    <p>Total Items: <span className="font-semibold">{orderedItems.length}</span></p>
                    <p>Total Price: <span className="font-semibold">₹5,499</span></p>
                    <p>Delivery Address: <span className="font-semibold">John Doe, 123 Street, City</span></p>
                </div>

                {/* Ordered Items List */}
                <div className="mt-4 bg-gray-100 p-4 rounded-md flex-grow overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-2">Items in Order:</h3>
                    <ul className="space-y-2">
                        {orderedItems.map((item) => (
                            <li key={item.id} className="flex justify-between bg-white p-2 rounded-md shadow-sm">
                                <span>{item.name}</span>
                                <span className="font-semibold">{item.price}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg h-[450px] flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Complete Your Payment</h2>

                {/* Payment Method Selection */}
                <label className="block text-lg font-medium text-gray-700 mb-3">Select Payment Method:</label>
                <div className="space-y-3 flex-grow">
                    {["Credit Card", "Debit Card", "UPI", "Net Banking"].map((method) => (
                        <label key={method} className="flex items-center space-x-3 bg-gray-100 p-3 rounded-md cursor-pointer hover:bg-gray-200">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={method}
                                checked={paymentMethod === method}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-5 h-5 text-green-600"
                            />
                            <span className="text-gray-800 font-medium">{method}</span>
                        </label>
                    ))}
                </div>

                {/* Pay Now Button */}
                <button
                    onClick={handlePayment}
                    className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-md transition-all mt-4">
                    {isProcessing ? "Processing..." : "Pay Now"}
                </button>
            </div>
        </div>
    );
};

export default OrderSummary;
