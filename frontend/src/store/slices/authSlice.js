import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

const initialState = {
  user: null,
  isAuthenticated: false,
  userRole: null, // Add userRole to initial state
  loading: true,
  error: null
};

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, signal }) => {
    try {
      const { data } = await api.get('/users/profile', { signal });
      
      if (!data) {
        throw new Error(data?.message || 'Authentication failed');
      }

      return data;
    } catch (err) {
      if (err.name === 'AbortError') {
        return rejectWithValue('Request cancelled');
      }
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/users/profile');
      if (!data.success) {
        throw new Error('Authentication failed');
      }
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/users/profile');
      if (!data.success) {
        throw new Error(data?.message || 'Failed to fetch profile');
      }
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Add updateProfile thunk
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await api.patch('/users/updateProfile', profileData);
      
      if (!data.success) {
        throw new Error(data?.message || 'Failed to update profile');
      }
      
      // Fetch updated profile data to ensure state is current
      dispatch(fetchUserProfile());
      
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Add address management thunks
export const addAddress = createAsyncThunk(
  'auth/addAddress',
  async (addressData, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await api.post('/users/updateAddress', addressData);
      
      if (!data.success) {
        throw new Error(data?.message || 'Failed to add address');
      }
      
      // Fetch updated profile to get the new address list
      dispatch(fetchUserProfile());
      
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateAddress = createAsyncThunk(
  'auth/updateAddress',
  async (address, { rejectWithValue }) => {
    try {
      // Send the address object directly to the backend
      const { data } = await api.patch('/users/updateAddress', { address });
      
      if (!data.success) {
        throw new Error(data?.message || 'Failed to update address');
      }
      
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'auth/deleteAddress',
  async (addressId, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await api.delete(`/users/deleteAddress/${addressId}`);
      
      if (!data.success) {
        throw new Error(data?.message || 'Failed to delete address');
      }
      
      // Fetch updated profile to get the updated address list
      dispatch(fetchUserProfile());
      
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Add this thunk after other thunks
export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const { data } = await api.patch('/users/updatePassword', passwordData);
      if (!data.success) {
        throw new Error(data?.message || 'Failed to update password');
      }
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update logout thunk to clear cookies from backend
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await api.post('/users/logout');
      dispatch(logout());
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Modify the authSlice with persistence in mind
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.userRole = action.payload.user?.user?.role || action.payload.user?.role;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.userRole = null;
      state.loading = false;
    },
    // Add this new reducer for setting error state
    setError: (state, action) => {
      state.error = action.payload;
    },
    // Add a new reducer for clearing error state
    clearError: (state) => {
      state.error = null;
    },
    // Add a new reducer to handle persistence
    persistLogin: (state) => {
      // This is a no-op reducer that just ensures the state is maintained
      // It's useful for explicitly showing intent
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.userRole = action.payload.user?.role; // Set user role from profile
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add updateProfile cases
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // No need to update state here as we're dispatching fetchUserProfile
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add address management cases
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // No need to update state here as we're dispatching fetchUserProfile
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // No need to update state here as we're dispatching fetchUserProfile
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // No need to update state here as we're dispatching fetchUserProfile
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add these cases in extraReducers
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCredentials, logout, setError, clearError, persistLogin } = authSlice.actions;
export default authSlice.reducer;
