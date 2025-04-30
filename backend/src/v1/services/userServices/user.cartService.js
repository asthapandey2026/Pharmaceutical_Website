import Cart from "../../models/cart.Model.js";
import mongoose from "mongoose";

const cartService = {
  async getCartByUserId(userId) {
    try {
      const cart = await Cart.findOne({ userId })
        .populate("products.productId")
        .exec();
      return cart || { userId, products: [] };
    } catch (error) {
      throw new Error("Error fetching cart: " + error.message);
    }
  },

  async addToCart(userId, productId, quantity) {
    try {
      // Validate inputs
      if (!userId || !productId) {
        throw new Error("User ID and Product ID are required");
      }
      
      // Ensure productId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product ID format");
      }
      
      // Convert quantity to number if it's not already
      const qtyNum = parseInt(quantity);
      if (isNaN(qtyNum) || qtyNum <= 0) {
        throw new Error("Quantity must be a positive number");
      }

      // Find cart or create one
      let cart = await Cart.findOne({ userId });
      
      if (!cart) {
        // Create new cart if it doesn't exist
        cart = new Cart({
          userId,
          products: []
        });
      }
      
      // Check if product already exists in cart
      const existingProductIndex = cart.products.findIndex(
        item => item && item.productId && item.productId.toString() === productId.toString()
      );
      
      if (existingProductIndex >= 0) {
        // Update quantity if product exists
        cart.products[existingProductIndex].quantity += qtyNum;
      } else {
        // Add new product
        cart.products.push({
          productId,
          quantity: qtyNum
        });
      }
      
      // Save and return populated cart
      await cart.save();
      return await Cart.findOne({ userId }).populate("products.productId");
      
    } catch (error) {
      throw new Error("Error adding to cart: " + error.message);
    }
  },

  async removeFromCart(userId, productId) {
    try {
      // Validate inputs
      if (!userId || !productId) {
        throw new Error("User ID and Product ID are required");
      }
      
      // Ensure productId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product ID format");
      }

      // Find cart
      const cart = await Cart.findOne({ userId });
      if (!cart) return null;
      
      // Filter out the product to remove, with extra safety checks
      cart.products = cart.products.filter(
        item => item && item.productId && item.productId.toString() !== productId.toString()
      );
      
      // Save and return populated cart
      await cart.save();
      return await Cart.findOne({ userId }).populate("products.productId");
      
    } catch (error) {
      throw new Error("Error removing from cart: " + error.message);
    }
  },

  async updateCart(userId, productId, quantity) {
    console.log(userId, productId, quantity);
    
    try {
      // Validate inputs
      if (!userId || !productId) {
        throw new Error("User ID and Product ID are required");
      }
      
      // Ensure productId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product ID format");
      }
      
      // Convert quantity to number if it's not already
      const qtyNum = parseInt(quantity);
      if (isNaN(qtyNum) || qtyNum <= 0) {
        throw new Error("Quantity must be a positive number");
      }

      // Log for debugging
      console.log("UpdateCart inputs:", { userId, productId, quantity: qtyNum });

      // Find cart
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        console.log("Cart not found for user", userId);
        return null;
      }
      
      // Debug cart products
      console.log("Current cart products:", JSON.stringify(cart.products));
      
      // Find product index with extra validation
      const productIndex = cart.products.findIndex(item => {
        if (!item || !item.productId) return false;
        return item.productId.toString() === productId.toString();
      });
      
      console.log("Product index found:", productIndex);
      
      if (productIndex >= 0) {
        // Update quantity
        cart.products[productIndex].quantity = qtyNum;
        console.log("Updated quantity to:", qtyNum);
      } else {
        console.log("Product not found in cart");
        // Optionally add the product if it doesn't exist
        cart.products.push({
          productId,
          quantity: qtyNum
        });
      }
      
      // Save and return populated cart
      await cart.save();
      const updatedCart = await Cart.findOne({ userId }).populate("products.productId");
      console.log("Updated cart:", updatedCart);
      return updatedCart;
      
    } catch (error) {
      console.error("Error in updateCart:", error);
      throw new Error("Error updating cart: " + error.message);
    }
  },

  async clearCart(userId) {
    try {
      // Validate input
      if (!userId) {
        throw new Error("User ID is required");
      }

      // Find cart
      const cart = await Cart.findOne({ userId });
      if (!cart) return null;
      
      // Clear products array
      cart.products = [];
      
      // Save and return populated cart
      await cart.save();
      return await Cart.findOne({ userId }).populate("products.productId");
      
    } catch (error) {
      throw new Error("Error clearing cart: " + error.message);
    }
  }
};

export default cartService;