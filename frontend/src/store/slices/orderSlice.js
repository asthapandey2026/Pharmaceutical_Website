import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

// Async thunk for fetching user's orders
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/orders");
      console.log("Orders API response:", response.data);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch orders" });
    }
  }
);

// Async thunk for fetching a specific order by ID
export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/orders/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch order details" });
    }
  }
);

// Async thunk for cancelling an order
export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/users/orders/${orderId}/cancel`);
      console.log("Cancel order response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to cancel order" });
    }
  }
);

// Async thunk for track order status
export const trackOrder = createAsyncThunk(
  "orders/trackOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      // Fixed: Added orderId parameter back to the URL
      const response = await api.get(`/users/orders/${orderId}/track`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to track order" });
    }
  }
);

// Initial state
const initialState = {
  orders: [],
  currentOrder: null,
  trackingInfo: null,
  loading: false,
  fetchingOrder: false,
  trackingLoading: false,
  error: null,
  cancellingOrder: false,
  cancelError: null,
  successMessage: null,
  expandedOrder: null
};

// Create the order slice
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
      state.cancelError = null;
      state.successMessage = null;
    },
    setExpandedOrder: (state, action) => {
      state.expandedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchUserOrders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        
        // Handle different response structures
        if (action.payload?.data?.orders) {
          state.orders = action.payload.data.orders;
        } else if (action.payload?.orders) {
          state.orders = action.payload.orders;
        } else if (action.payload?.data) {
          // If data is directly the orders array or contains orders property
          if (Array.isArray(action.payload.data)) {
            state.orders = action.payload.data;
          } else {
            state.orders = action.payload.data.orders || [];
          }
        } else if (Array.isArray(action.payload)) {
          state.orders = action.payload;
        } else {
          console.error("Unexpected orders response format:", action.payload);
          state.orders = [];
        }
        
        console.log("Orders stored in state:", state.orders);
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch orders";
      })

      // Handle fetchOrderById
      .addCase(fetchOrderById.pending, (state) => {
        state.fetchingOrder = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.fetchingOrder = false;
        // Handle different response structures
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
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.fetchingOrder = false;
        state.error = action.payload?.message || "Failed to fetch order details";
      })

      // Handle cancelOrder
      .addCase(cancelOrder.pending, (state) => {
        state.cancellingOrder = true;
        state.cancelError = null;
        state.successMessage = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.cancellingOrder = false;
        state.successMessage = "Order cancelled successfully";
        
        // Determine the cancelled order ID based on different possible response structures
        let cancelledOrderId;
        
        if (action.payload?.orderId) {
          cancelledOrderId = action.payload.orderId;
        } else if (action.payload?.data?.orderId) {
          cancelledOrderId = action.payload.data.orderId;
        } else if (action.payload?.order?.orderId) {
          cancelledOrderId = action.payload.order.orderId;
        } else if (action.payload?.order?._id) {
          cancelledOrderId = action.payload.order._id;
        }
        
        console.log("Cancelled order ID:", cancelledOrderId);
        
        // Update the order in the orders array if we have an ID
        if (cancelledOrderId) {
          state.orders = state.orders.map(order => {
            // Check for both orderId and _id
            if ((order.orderId && order.orderId === cancelledOrderId) || 
                (order._id && order._id === cancelledOrderId)) {
              return { ...order, status: "Cancelled" };
            }
            return order;
          });
          
          // Update currentOrder if it's the cancelled order
          if (state.currentOrder && 
              ((state.currentOrder.orderId && state.currentOrder.orderId === cancelledOrderId) ||
               (state.currentOrder._id && state.currentOrder._id === cancelledOrderId))) {
            state.currentOrder = { ...state.currentOrder, status: "Cancelled" };
          }
        } else {
          console.warn("Could not determine cancelled order ID from response:", action.payload);
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.cancellingOrder = false;
        state.cancelError = action.payload?.message || "Failed to cancel order";
      })

      // Handle trackOrder
      .addCase(trackOrder.pending, (state) => {
        state.trackingLoading = true;
        state.error = null;
      })
      .addCase(trackOrder.fulfilled, (state, action) => {
        state.trackingLoading = false;
        
        // Handle different response structures
        if (action.payload?.tracking) {
          state.trackingInfo = action.payload.tracking;
        } else if (action.payload?.data?.tracking) {
          state.trackingInfo = action.payload.data.tracking;
        } else if (action.payload?.data) {
          state.trackingInfo = action.payload.data;
        } else {
          state.trackingInfo = null;
        }
      })
      .addCase(trackOrder.rejected, (state, action) => {
        state.trackingLoading = false;
        state.error = action.payload?.message || "Failed to track order";
      });
  },
});

export const { clearOrderError, setExpandedOrder } = orderSlice.actions;
export default orderSlice.reducer;