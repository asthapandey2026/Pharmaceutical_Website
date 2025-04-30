import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchUserOrders,
  trackOrder,
  cancelOrder,
  setExpandedOrder,
} from "../store/slices/orderSlice";

const CurrentPurchase = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0); // Add a refresh key for re-renders

  const {
    orders,
    loading,
    error,
    expandedOrder,
    trackingInfo,
    trackingLoading,
    cancellingOrder,
    successMessage
  } = useSelector((state) => state.orders);

  // Effect for initial data loading
  useEffect(() => {
    dispatch(fetchUserOrders());
    console.log("Current orders state:", orders);
  }, [dispatch, refreshKey]); // Also refresh when refreshKey changes

  // Effect to handle success message and refresh
  useEffect(() => {
    if (successMessage) {
      // Show a toast/alert for user feedback
      alert(successMessage);
      
      // Refresh the orders list
      setRefreshKey(prev => prev + 1);
    }
  }, [successMessage]);

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      dispatch(setExpandedOrder(null));
    } else {
      dispatch(setExpandedOrder(orderId));
      dispatch(trackOrder(orderId));
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        // Wait for the cancel action to complete
        await dispatch(cancelOrder(orderId)).unwrap();
        
        // After successful cancellation, refresh orders
        dispatch(fetchUserOrders());
        
        // Close the expanded view if it was open
        if (expandedOrder === orderId) {
          dispatch(setExpandedOrder(null));
        }
      } catch (error) {
        console.error("Failed to cancel order:", error);
      }
    }
  };

  const handleInvoiceClick = (orderId) => {
    navigate(`/invoice/${orderId}`);
  };

  if (loading && !cancellingOrder) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="text-blue-500 font-semibold">{error}</div>
      </div>
    );
  }

  // Debug output
  console.log("Rendering with orders:", orders);

  if (!orders || !orders.length) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <div className="text-gray-500 font-semibold mb-4">No orders found.</div>
        <button 
          onClick={() => navigate('/products')} 
          className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-10 bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Orders</h2>
        
        {/* Show loading overlay during cancellation */}
        {cancellingOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-5 rounded-lg flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-800"></div>
              <p>Cancelling order...</p>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2 text-left">Order ID</th>
                <th className="border border-gray-300 p-2 text-left">Order Date</th>
                <th className="border border-gray-300 p-2 text-left">Total</th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
                <th className="border border-gray-300 p-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order.orderId || `order-${Math.random()}`}>
                  <tr className="border border-gray-300 bg-white hover:bg-gray-50 transition duration-200">
                    <td className="p-4">
                      {order.orderId?.substring(0, 8) || "N/A"}...
                    </td>
                    <td className="p-4">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="p-4">₹{(order.totalPrice || 0).toFixed(2)}</td>
                    <td className="p-4 font-semibold">
                      <span
                        className={`${
                          order.status === "Delivered"
                            ? "text-green-600"
                            : order.status === "Pending" || order.status === "Processing" 
                            ? "text-yellow-600"
                            : order.status === "Shipped"
                            ? "text-blue-600"
                            : order.status === "Cancelled"
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-center flex justify-center space-x-2">
                      <button
                        onClick={() => toggleOrderDetails(order.orderId)}
                        className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded-md"
                      >
                        {expandedOrder === order.orderId ? "Hide Details" : "View Details"}
                      </button>
                      {(order.status === "Delivered" || order.status === "Shipped") && (
                        <button
                          className="bg-blue-800 hover:bg-blue-900 text-white px-3 py-1 rounded-md"
                          onClick={() => handleInvoiceClick(order.orderId)}
                        >
                          Invoice
                        </button>
                      )}
                      {(order.status === "Pending" || order.status === "Processing") && (
                        <button
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md"
                          onClick={() => handleCancelOrder(order.orderId)}
                          disabled={cancellingOrder}
                        >
                          {cancellingOrder ? "Cancelling..." : "Cancel"}
                        </button>
                      )}
                    </td>
                  </tr>
                  {expandedOrder === order.orderId && (
                    <tr className="border-b border-gray-300 bg-gray-50">
                      <td colSpan="5" className="p-4">
                        {trackingLoading ? (
                          <div className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-800"></div>
                          </div>
                        ) : (
                          <div>
                            <h3 className="text-md font-bold mb-2">Order Details:</h3>
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold mb-1">Items:</h4>
                              <ul className="list-disc pl-5 text-gray-700">
                                {order.products?.map((product, index) => (
                                  <li key={index} className="mb-1">
                                    {product.name} × {product.quantity} - ₹{product.price}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold mb-1">
                                Shipping Address:
                              </h4>
                              <p className="text-gray-700">
                                {order.address?.houseNo || ""}, {order.address?.street || ""},{" "}
                                {order.address?.locality || ""}, {order.address?.city || ""} - {order.address?.pinCode || ""}
                              </p>
                            </div>
                            {trackingInfo && trackingInfo.updates && (
                              <div>
                                <h4 className="text-sm font-semibold mb-1">
                                  Order Updates:
                                </h4>
                                <ul className="list-disc pl-5 text-gray-700">
                                  {trackingInfo.updates.map((update, index) => (
                                    <li key={index} className="flex items-center">
                                      <span className="w-32 text-gray-500 text-sm">
                                        {new Date(update.timestamp).toLocaleDateString()}
                                      </span>
                                      <span>{update.status}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            <div className="mt-4 p-3 bg-gray-100 rounded-md">
                              <div className="flex justify-between">
                                <span className="font-medium">Order Status:</span>
                                <span className="font-semibold">{order.status}</span>
                              </div>
                              <div className="flex justify-between mt-2">
                                <span className="font-medium">Order Date:</span>
                                <span>{order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</span>
                              </div>
                              <div className="flex justify-between mt-2">
                                <span className="font-medium">Total Amount:</span>
                                <span className="font-semibold">₹{(order.totalPrice || 0).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CurrentPurchase;
