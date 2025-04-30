import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus, updateExpectedDelivery } from "../store/slices/adminOrderSlice";

const AdminPurchaseRequests = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { orders, loading, error, successMessage } = useSelector(state => state.adminOrders);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  
  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);
  
  useEffect(() => {
    if (successMessage) {
      // Could use a toast notification here
      alert(successMessage);
    }
  }, [successMessage]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  const handleExpectedDeliveryChange = (orderId, newDate) => {
    dispatch(updateExpectedDelivery({ orderId, expectedDelivery: newDate }));
  };

  const handleViewInvoice = (orderId) => {
    navigate(`/admin/invoice/${orderId}`);
  };
  
  // Format date for display using native JS
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    } catch (e) {
      return "Invalid Date";
    }
  };
  
  // Format date for input value using native JS
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    } catch (e) {
      return "";
    }
  };

  // Get customer name from response
  const getCustomerName = (order) => {
    if (order.userId?.name?.firstName) {
      return `${order.userId.name.firstName} ${order.userId.name.lastName || ""}`;
    }
    if (order.address?.name) {
      return order.address.name;
    }
    return "N/A";
  };

  // Get customer contact from response
  const getCustomerContact = (order) => {
    if (order.mobile) {
      return order.mobile;
    }
    if (order.address?.mobile) {
      return order.address.mobile;
    }
    if (order.userId?.email) {
      return order.userId.email;
    }
    return null;
  };

  const statusOptions = [
    "Order placed",
    "Pending",
    "Approved",
    "Packed",
    "Shipped",
    "Dispatched",
    "Out for Delivery",
    "Delivered",
    "Cancelled"
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center flex-col bg-gray-100">
        <p className="text-blue-600 mb-4">{error}</p>
        <button 
          onClick={() => dispatch(fetchAllOrders())} 
          className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id && order._id.toString().toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !filterStatus || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen mt-10 bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h2>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by Order ID..."
              className="w-full p-2 border rounded-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-64">
            <select
              className="w-full p-2 border rounded-md"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        
        {!filteredOrders || filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2 text-left">Order ID</th>
                  <th className="border p-2 text-left">Customer</th>
                  <th className="border p-2 text-left">Order Date</th>
                  <th className="border p-2 text-left">Amount</th>
                  <th className="border p-2 text-left">Status</th>
                  <th className="border p-2 text-left">Payment Method</th>
                  <th className="border p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr 
                    key={order._id} 
                    className={`border hover:bg-gray-50 ${
                      order.status === "Delivered" ? "bg-green-50" :
                      order.status === "Cancelled" ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="p-2">{order._id?.substring(0, 8)}...</td>
                    <td className="p-2">
                      {getCustomerName(order)}
                      {getCustomerContact(order) && (
                        <div className="text-xs text-gray-500">{getCustomerContact(order)}</div>
                      )}
                    </td>
                    <td className="p-2">{formatDate(order.orderDate || order.createdAt)}</td>
                    <td className="p-2">₹{order.totalPrice?.toFixed(2) || "0.00"}</td>
                    <td className="p-2">
                      <select
                        className={`border p-1 rounded-md w-full ${
                          order.status === "Cancelled" ? "bg-blue-100" :
                          order.status === "Delivered" ? "bg-green-100" :
                          order.status === "Shipped" || order.status === "Dispatched" ? "bg-blue-100" : ""
                        }`}
                        value={order.status || ""}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs 
                        ${order.paymentMethod === "COD" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}>
                        {order.paymentMethod || "N/A"}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button 
                          className="bg-blue-800 hover:bg-blue-900 text-white px-3 py-1 rounded-md text-xs w-full sm:w-auto"
                          onClick={() => handleViewInvoice(order._id)}
                        >
                          View Invoice
                        </button>
                        <button 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs w-full sm:w-auto"
                          onClick={() => navigate(`/admin/order/${order._id}`)}
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPurchaseRequests;
