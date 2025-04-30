import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { fetchCart, updateCartItem, removeFromCart, clearCartThunk } from "../store/slices/cartSlice";
import { toast } from "react-toastify";

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading, error, total } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  
  // Calculate totals whenever items change
  useEffect(() => {
    const subtotal = items.reduce((sum, item) => {
      const price = item.productId?.price || 0;
      return sum + (price * item.quantity);
    }, 0);
    
    const discountAmount = subtotal * 0.05; // 5% discount
    setDiscount(discountAmount);
    setFinalTotal(subtotal - discountAmount);
  }, [items]);

  // Fetch cart data when component mounts
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    dispatch(fetchCart())
      .unwrap()
      .catch(error => {
        toast.error(error || "Failed to load your cart");
      });
  }, [isAuthenticated, navigate, dispatch]);

  // Helper function to get product ID in a consistent way
  const getProductId = (item) => {
    if (item.productId?._id) {
      return item.productId._id;
    }
    return item.productId;
  };

  // Handle quantity change
  const handleQuantityChange = async (id, type) => {
    try {
      const item = items.find(item => getProductId(item) === id);
      
      if (!item) return;
      
      const newQuantity = type === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
      
      await dispatch(updateCartItem({ productId: id, quantity: newQuantity })).unwrap();
      toast.success("Cart updated successfully");
      
    } catch (error) {
      toast.error(error || "Failed to update quantity");
    }
  };

  // Navigate to checkout
  const handleProceedToCheckout = () => {
    navigate("/deliveryForm");
  };

  // Remove item from cart
  const handleRemoveItem = async (id) => {
    try {
      await dispatch(removeFromCart(id)).unwrap();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(error || "Failed to remove item");
    }
  };

  // Clear cart
  const handleClearCart = async () => {
    try {
      await dispatch(clearCartThunk()).unwrap();
      toast.success("Cart cleared successfully");
    } catch (error) {
      toast.error(error || "Failed to clear cart");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen mt-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen mt-16 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium text-blue-600 mb-4">Error loading cart</h2>
          <p className="mb-4 text-gray-700">{error}</p>
          <button 
            onClick={() => dispatch(fetchCart())} 
            className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 px-3 py-1 border border-blue-600 rounded-md hover:bg-blue-50"
            >
              <FaTrash size={14} />
              <span>Clear Cart</span>
            </button>
          )}
        </div>
        
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-medium text-gray-700 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
            <button 
              onClick={() => navigate('/products')} 
              className="bg-blue-800 text-white px-6 py-3 rounded-md hover:bg-blue-900 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Cart Items ({items.length})
                  </h2>
                </div>
                
                {items.map((item) => {
                  const product = item.productId;
                  const id = getProductId(item);
                  
                  return (
                    <div key={item._id || id} className="p-6 border-b border-gray-200 hover:bg-gray-50">
                      <div className="flex flex-col sm:flex-row gap-6">
                        {/* Product Image */}
                        <div className="w-full sm:w-24">
                          <img
                            src={product?.images || "/placeholder-product.jpg"}
                            alt={product?.name || "Product"}
                            className="w-full h-24 object-cover rounded-md cursor-pointer"
                            onClick={() => navigate(`/product/${id}`)}
                          />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 
                            className="text-lg font-medium text-gray-800 cursor-pointer hover:text-blue-800"
                            onClick={() => navigate(`/product/${id}`)}
                          >
                            {product?.name || "Product"}
                          </h3>
                          <p className="text-gray-500 text-sm mb-1 line-clamp-2">
                            {product?.description || "No description available"}
                          </p>
                          <p className="text-green-600 text-sm">Free Delivery</p>
                          <div className="mt-2 flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <button
                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                onClick={() => handleQuantityChange(id, "decrease")}
                                disabled={item.quantity <= 1 || loading}
                              >
                                <span className="text-gray-700">-</span>
                              </button>
                              <span className="mx-2 w-8 text-center">{item.quantity}</span>
                              <button
                                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                onClick={() => handleQuantityChange(id, "increase")}
                                disabled={loading}
                              >
                                <span className="text-gray-700">+</span>
                              </button>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <p className="text-lg font-bold text-gray-900">
                                ₹{((product?.price || 0) * item.quantity).toFixed(2)}
                              </p>
                              <button
                                onClick={() => handleRemoveItem(id)}
                                className="text-gray-400 hover:text-blue-500 transition-colors"
                                title="Remove item"
                                disabled={loading}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({items.length} items)</span>
                    <span className="font-medium">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discount (5%)</span>
                    <span className="font-medium text-green-600">-₹{discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-800">Total</span>
                      <span className="text-lg font-bold text-gray-800">₹{finalTotal.toFixed(2)}</span>
                    </div>
                    <p className="text-green-600 text-sm mt-1">You saved ₹{discount.toFixed(2)} on this order</p>
                  </div>
                </div>
                
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-blue-800 text-white py-3 px-4 rounded-md hover:bg-blue-900 transition-colors font-medium"
                  disabled={loading || items.length === 0}
                >
                  {loading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
                
                <button
                  onClick={() => navigate('/products')}
                  className="w-full mt-3 bg-white text-gray-800 py-3 px-4 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
