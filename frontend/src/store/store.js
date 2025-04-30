import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import { combineReducers } from 'redux';

// Import reducers
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import enquiryReducer from "./slices/enquirySlice";
import bannerReducer from "./slices/bannerSlice";
import productReducer from "./slices/productSlice";
import orderReducer from "./slices/orderSlice";
import adminOrderReducer from "./slices/adminOrderSlice";

// Configure persist options
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart'] // only auth and cart will be persisted
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  enquiry: enquiryReducer,
  banner: bannerReducer,
  products: productReducer,
  orders: orderReducer,
  adminOrders: adminOrderReducer

});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer
});

export const persistor = persistStore(store);