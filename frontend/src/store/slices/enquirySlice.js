import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/axios";

const initialState = {
  isOpen: false,
  enquiries: [],
  currentEnquiry: null,
  loading: false,
  error: null,
  lastPolled: null
};

// Create enquiry (for users)
export const createEnquiry = createAsyncThunk(
  "enquiry/createEnquiry",
  async (enquiryData, { rejectWithValue }) => {
    try {
      // Send only the query text - backend will handle array structure
      const payload = {
        query: enquiryData.query
      };
      const { data } = await api.post("/users/makeQuerry", payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to send enquiry");
    }
  }
);

// Get user's enquiries (for users)
export const getUserEnquiries =  createAsyncThunk(
  "enquiry/getUserEnquiries",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/users/getQuerries");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch enquiries");
    }
  }
);

// Get all enquiries (for admin)
export const getAllEnquiries = createAsyncThunk(
  "enquiry/getAllEnquiries",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/userQueries");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch enquiries");
    }
  }
);

// Respond to enquiry (for admin)
export const respondToEnquiry = createAsyncThunk(
  "enquiry/respondToEnquiry",
  async ({ enquiryId, response, responseIndex }, { rejectWithValue }) => {
    try {
      const payload = {
        response,
        responseIndex // Include the index in the payload
      };
      const { data } = await api.patch(`/admin/answerQueries/${enquiryId}`, payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to send response");
    }
  }
);

// Add new thunk actions at the top with other createAsyncThunk calls
export const clearConversation = createAsyncThunk(
  'enquiry/clearConversation',
  async (enquiryId, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/users/clearConversation/${enquiryId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear conversation');
    }
  }
);

export const fetchSingleEnquiry = createAsyncThunk(
  'enquiry/fetchSingle',
  async (enquiryId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/admin/getUserQuery/${enquiryId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch enquiry');
    }
  }
);

// Add timestamp to track last poll time
export const pollEnquiries = createAsyncThunk(
  "enquiry/pollEnquiries",
  async (isAdmin, { getState, dispatch }) => {
    const state = getState();
    const lastPolled = state.enquiry.lastPolled;

    try {
      if (isAdmin) {
        return dispatch(getAllEnquiries());
      } else {
        return dispatch(getUserEnquiries());
      }
    } catch (err) {
      console.error('Polling failed:', err);
    }
  }
);

const enquirySlice = createSlice({
  name: "enquiry",
  initialState,
  reducers: {
    openPopup: (state) => {
      state.isOpen = true;
    },
    closePopup: (state) => {
      state.isOpen = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateLastPolled: (state) => {
      state.lastPolled = new Date().toISOString();
    },
    updateSelectedEnquiry: (state, action) => {
      // Update the enquiry in the list
      const index = state.enquiries.findIndex(e => e._id === action.payload._id);
      if (index !== -1) {
        state.enquiries[index] = {
          ...action.payload,
          query: Array.isArray(action.payload.query) ? action.payload.query : [action.payload.query],
          response: Array.isArray(action.payload.response) ? action.payload.response : []
        };
      }
      // Also update currentEnquiry for immediate UI updates
      state.currentEnquiry = {
        ...action.payload,
        query: Array.isArray(action.payload.query) ? action.payload.query : [action.payload.query],
        response: Array.isArray(action.payload.response) ? action.payload.response : []
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the response where query might be an array
        const newEnquiry = {
          ...action.payload,
          query: Array.isArray(action.payload.query) ? action.payload.query : [action.payload.query],
          response: Array.isArray(action.payload.response) ? action.payload.response : []
        };
        state.enquiries.push(newEnquiry);
      })
      .addCase(createEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserEnquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserEnquiries.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure queries and responses are always arrays
        state.enquiries = action.payload.map(enquiry => ({
          ...enquiry,
          query: Array.isArray(enquiry.query) ? enquiry.query : [enquiry.query],
          response: Array.isArray(enquiry.response) ? enquiry.response : []
        }));
      })
      .addCase(getUserEnquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllEnquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllEnquiries.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure queries and responses are always arrays
        state.enquiries = action.payload.map(enquiry => ({
          ...enquiry,
          query: Array.isArray(enquiry.query) ? enquiry.query : [enquiry.query],
          response: Array.isArray(enquiry.response) ? enquiry.response : []
        }));
      })
      .addCase(getAllEnquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(respondToEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(respondToEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        const updatedEnquiry = action.payload;
        const index = state.enquiries.findIndex(e => e._id === updatedEnquiry._id);
        if (index !== -1) {
          state.enquiries[index] = updatedEnquiry;
        }
      })
      .addCase(respondToEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(clearConversation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearConversation.fulfilled, (state, action) => {
        state.loading = false;
        // Update the enquiry in the list
        const index = state.enquiries.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.enquiries[index] = action.payload;
        }
        // Also update currentEnquiry if it's the same one
        if (state.currentEnquiry && state.currentEnquiry._id === action.payload._id) {
          state.currentEnquiry = action.payload;
        }
      })
      .addCase(clearConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSingleEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEnquiry = action.payload;
      })
      .addCase(fetchSingleEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export polling helper function
export const startPolling = (dispatch, isAdmin, interval = 30000) => {
  // Initial fetch
  dispatch(pollEnquiries(isAdmin));
  
  // Set up polling interval
  const pollInterval = setInterval(() => {
    dispatch(pollEnquiries(isAdmin));
  }, interval);

  // Return cleanup function
  return () => clearInterval(pollInterval);
};

export const { openPopup, closePopup, clearError, updateLastPolled, updateSelectedEnquiry } = enquirySlice.actions;
export default enquirySlice.reducer;
