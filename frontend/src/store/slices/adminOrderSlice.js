import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

// Fetch all orders (admin only)
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/orders");
      console.log("Orders API response:", response.data);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch orders" });
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to update order status" });
    }
  }
);

// Update expected delivery date
export const updateExpectedDelivery = createAsyncThunk(
  "adminOrders/updateExpectedDelivery",
  async ({ orderId, expectedDelivery }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/orders/${orderId}/delivery-date`, { 
        expectedDelivery 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { 
        message: "Failed to update expected delivery date" 
      });
    }
  }
);

// Get order details (admin view)
export const getOrderDetails = createAsyncThunk(
  "adminOrders/getOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/orders/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch order details" });
    }
  }
);

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  detailsLoading: false,
  error: null,
  successMessage: null,
  updatingStatus: false,
  updatingDelivery: false
};

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        
        // Handle different response formats
        if (action.payload?.orders) {
          state.orders = action.payload.orders;
        } else if (action.payload?.data?.orders) {
          state.orders = action.payload.data.orders;
        } else if (Array.isArray(action.payload?.data)) {
          state.orders = action.payload.data;
        } else if (Array.isArray(action.payload)) {
          state.orders = action.payload;
        } else {
          console.error("Unexpected response format:", action.payload);
          state.orders = [];
        }
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch orders";
      })
      
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.updatingStatus = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updatingStatus = false;
        state.successMessage = "Order status updated successfully";
        
        // Get updated order info
        const updatedOrderId = action.payload?.orderId || 
                               (action.payload?.order && action.payload.order._id) ||
                               (action.payload?.order && action.payload.order.orderId);
                               
        const updatedStatus = action.payload?.status || 
                             (action.payload?.order && action.payload.order.status);
        
        // Update order in the list
        if (updatedOrderId && updatedStatus) {
          state.orders = state.orders.map(order => {
            if (order.orderId === updatedOrderId || order._id === updatedOrderId) {
              return { ...order, status: updatedStatus };
            }
            return order;
          });
        }
        
        // Update current order if it's the one being edited
        if (state.currentOrder && 
            (state.currentOrder.orderId === updatedOrderId || 
             state.currentOrder._id === updatedOrderId)) {
          state.currentOrder = { ...state.currentOrder, status: updatedStatus };
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updatingStatus = false;
        state.error = action.payload?.message || "Failed to update order status";
      })
      
      // Update expected delivery date
      .addCase(updateExpectedDelivery.pending, (state) => {
        state.updatingDelivery = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateExpectedDelivery.fulfilled, (state, action) => {
        state.updatingDelivery = false;
        state.successMessage = "Expected delivery date updated successfully";
        
        // Get updated order info
        const updatedOrderId = action.payload?.orderId || 
                               (action.payload?.order && action.payload.order._id) ||
                               (action.payload?.order && action.payload.order.orderId);
                               
        const expectedDelivery = action.payload?.expectedDelivery || 
                                (action.payload?.order && action.payload.order.expectedDelivery);
        
        // Update order in the list
        if (updatedOrderId && expectedDelivery) {
          state.orders = state.orders.map(order => {
            if (order.orderId === updatedOrderId || order._id === updatedOrderId) {
              return { ...order, expectedDelivery };
            }
            return order;
          });
        }
        
        // Update current order if it's the one being edited
        if (state.currentOrder && 
            (state.currentOrder.orderId === updatedOrderId || 
             state.currentOrder._id === updatedOrderId)) {
          state.currentOrder = { ...state.currentOrder, expectedDelivery };
        }
      })
      .addCase(updateExpectedDelivery.rejected, (state, action) => {
        state.updatingDelivery = false;
        state.error = action.payload?.message || "Failed to update expected delivery date";
      })
      
      // Get order details
      .addCase(getOrderDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        
        // Handle different response formats
        if (action.payload?.order) {
          state.currentOrder = action.payload.order;
        } else if (action.payload?.data?.order) {
          state.currentOrder = action.payload.data.order;
        } else if (action.payload?.data) {
          state.currentOrder = action.payload.data;
        } else {
          state.currentOrder = null;
        }
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload?.message || "Failed to fetch order details";
      });
  }
});

export const { clearMessage } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;