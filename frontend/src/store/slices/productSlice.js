import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// Fetch All Products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/users/products');
      // console.log(data);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch Inactive Products
export const fetchInactiveProducts = createAsyncThunk(
  'products/fetchInactiveProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/inActive/Products');
      console.log('Inactive products response:', data);
      return data;
    } catch (err) {
      console.error('Error fetching inactive products:', err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Fetch Product by ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/users/products/${id}`);
      console.log('API Response:', data);
      if (!data) {
        throw new Error(data?.message || 'Failed to fetch product');
      }
      return data;
    } catch (err) {
      console.error('API Error:', err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Add New Product
export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/admin/addMedicines', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('API Response:', data); // Debug log

      if (!data.success) {
        throw new Error(data?.message || 'Failed to add product');
      }
      
      return data;
    } catch (err) {
      console.error('API Error:', err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update Product
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({id, formData}, { rejectWithValue }) => {
    try {
      console.log('Update API Request:', {id, formDataContent: Object.fromEntries(formData)});
      
      const { data } = await api.patch(`/admin/updateMedicines/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (!data) {
        throw new Error('No data received from server');
      }
      
      return data;
    } catch (err) {
      console.error('Update API Error:', {
        status: err.response?.status,
        message: err.message,
        data: err.response?.data
      });
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete Product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/deleteMedicines/${id}`);
      return id; // Return deleted product ID for easier state update
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    inactiveProducts: [],
    currentProduct: null,
    loading: false,
    inactiveLoading: false,
    error: null,
    inactiveError: null,
  },
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearInactiveErrors: (state) => {
      state.inactiveError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle existing fetchProducts cases
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle inactive products fetching
      .addCase(fetchInactiveProducts.pending, (state) => {
        state.inactiveLoading = true;
        state.inactiveError = null;
      })
      .addCase(fetchInactiveProducts.fulfilled, (state, action) => {
        // Handle different response formats
        if (Array.isArray(action.payload)) {
          state.inactiveProducts = action.payload;
        } else if (action.payload?.products) {
          state.inactiveProducts = action.payload.products;
        } else if (action.payload?.data) {
          state.inactiveProducts = Array.isArray(action.payload.data) 
            ? action.payload.data 
            : action.payload.data.products || [];
        } else {
          console.warn('Unexpected response format for inactive products:', action.payload);
          state.inactiveProducts = [];
        }
        state.inactiveLoading = false;
      })
      .addCase(fetchInactiveProducts.rejected, (state, action) => {
        state.inactiveLoading = false;
        state.inactiveError = action.payload;
      })

      // Handle existing product detail fetching
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.currentProduct = null;
        state.error = action.payload;
      })
      
      // Add Product
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        console.log('Update fulfilled:', action.payload); // Debug log
        state.currentProduct = action.payload;
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        console.error('Update rejected:', action.payload); // Debug log
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      });
  },
});

export const { clearCurrentProduct, clearInactiveErrors } = productSlice.actions;
export default productSlice.reducer;

