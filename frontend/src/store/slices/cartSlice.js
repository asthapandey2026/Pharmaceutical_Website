import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// Helper function to get consistent product ID
const getProductId = (item) => {
  if (item.productId?._id) {
    return item.productId._id;
  }
  return item.productId;
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('users/Cart');
      
      if (!data) {
        return rejectWithValue('Failed to fetch cart');
      }
      
      console.log('Fetched cart data:', data.cart?.products);
      
      return data.cart?.products || [];
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch cart';
      return rejectWithValue(message);
    }
  }
);

// Update the addToCart function
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, { getState, rejectWithValue }) => {
    try {
      // Check if item already exists in cart
      const { cart } = getState();
      const existingItem = cart.items.find(item => 
        getProductId(item) === productId
      );
      
      let response;
      
      // If item exists, update quantity instead of adding new item
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        response = await api.patch('users/updateCart', { 
          productId, 
          quantity: newQuantity 
        });
      } else {
        // Otherwise add new item
        response = await api.patch('users/addToCart', { productId, quantity });
      }
      
      const { data } = response;
      
      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to update cart');
      }
      
      // After successful API call, re-fetch the cart to ensure UI and backend are in sync
      const refreshResponse = await api.get('users/Cart');
      if (!refreshResponse.data.success) {
        console.log("Cart refreshed but couldn't get updated data");
      }
      
      // Return information about what happened
      if (existingItem) {
        return {
          productId,
          quantity: existingItem.quantity + quantity,
          existing: true,
          updatedCart: refreshResponse.data.cart?.products || []
        };
      } else {
        // Find the added item in the response
        const cartItem = data.cart?.products?.find(p => 
          getProductId(p) === productId
        );
        
        return {
          ...cartItem,
          updatedCart: refreshResponse.data.cart?.products || []
        };
      }
    } catch (error) {
      console.error("Cart update error:", error);
      const message = error.response?.data?.message || 'Failed to add item to cart';
      return rejectWithValue(message);
    }
  }
);

// Update the updateCartItem function
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      console.log(`Updating cart item: productId=${productId}, quantity=${quantity}`);
      
      const { data } = await api.patch('users/updateCart', { productId, quantity });
      
      console.log('Update response:', data);
      
      if (!data.success) {
        console.error('Failed to update cart item:', data.message);
        return rejectWithValue(data.message || 'Failed to update cart item');
      }
      
      // After successful update, re-fetch cart to ensure sync
      const refreshResponse = await api.get('users/Cart');
      console.log('Refreshed cart after update:', refreshResponse.data);
      
      return { 
        productId, 
        quantity,
        updatedCart: refreshResponse.data.cart?.products || []
      };
    } catch (error) {
      console.error('Cart update error:', error);
      const message = error.response?.data?.message || 'Failed to update cart item';
      return rejectWithValue(message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await api.patch('users/removeFromCart', { productId });
      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to remove item from cart');
      }
      return productId;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item from cart';
      return rejectWithValue(message);
    }
  }
);

export const clearCartThunk = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post('users/clearCart');
      if (!data.success) {
        return rejectWithValue(data.message || 'Failed to clear cart');
      }
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to clear cart';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { productId, product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => getProductId(item) === productId
      );
      
      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        state.items.push({
          productId: product || productId,
          quantity: quantity
        });
      }
      
      // Recalculate total
      state.total = state.items.reduce((sum, item) => {
        const price = item.productId?.price || 0;
        return sum + price * item.quantity;
      }, 0);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => getProductId(item) !== action.payload);
      
      // Recalculate total
      state.total = state.items.reduce((sum, item) => {
        const price = item.productId?.price || 0;
        return sum + price * item.quantity;
      }, 0);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => getProductId(item) === productId);
      
      if (item) {
        item.quantity = quantity;
      }
      
      // Recalculate total
      state.total = state.items.reduce((sum, item) => {
        const price = item.productId?.price || 0;
        return sum + price * item.quantity;
      }, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        
        // Calculate total
        state.total = state.items.reduce((sum, item) => {
          const price = item.productId?.price || 0;
          return sum + price * item.quantity;
        }, 0);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload) {
          // If we got back the entire updated cart, use it
          if (action.payload.updatedCart && action.payload.updatedCart.length > 0) {
            state.items = action.payload.updatedCart;
          } else if (action.payload.existing) {
            // Update existing item quantity
            const itemIndex = state.items.findIndex(item => 
              getProductId(item) === action.payload.productId
            );
            
            if (itemIndex !== -1) {
              state.items[itemIndex].quantity = action.payload.quantity;
            }
          } else {
            // Add as new item if it doesn't already exist in state
            const existingItemIndex = state.items.findIndex(item => 
              getProductId(item) === getProductId(action.payload)
            );
            
            if (existingItemIndex !== -1) {
              // If item exists in state but we got a new item from API
              state.items[existingItemIndex].quantity += action.payload.quantity || 1;
            } else {
              // Brand new item
              state.items.push(action.payload);
            }
          }
          
          // Recalculate total
          state.total = state.items.reduce((sum, item) => {
            const price = item.productId?.price || 0;
            return sum + price * item.quantity;
          }, 0);
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Update cart item fulfilled with payload:', action.payload);
        
        // If we got the entire updated cart, use it
        if (action.payload.updatedCart && action.payload.updatedCart.length > 0) {
          state.items = action.payload.updatedCart;
        } else {
          // Otherwise just update the specific item
          const { productId, quantity } = action.payload;
          
          const itemIndex = state.items.findIndex(item => getProductId(item) === productId);
          
          if (itemIndex !== -1) {
            console.log(`Updating item at index ${itemIndex} to quantity ${quantity}`);
            state.items[itemIndex].quantity = quantity;
          } else {
            console.warn(`Could not find item with productId ${productId} in cart to update`);
          }
        }
        
        // Recalculate total
        state.total = state.items.reduce((sum, item) => {
          const price = item.productId?.price || 0;
          return sum + price * item.quantity;
        }, 0);
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        const productIdToRemove = action.payload;
        
        state.items = state.items.filter(item => getProductId(item) !== productIdToRemove);
        
        // Recalculate total
        state.total = state.items.reduce((sum, item) => {
          const price = item.productId?.price || 0;
          return sum + price * item.quantity;
        }, 0);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Clear cart
      .addCase(clearCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.total = 0;
      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
