import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../../utils/axios";
import { toast } from "react-toastify";
import { clearCart } from "../../store/slices/cartSlice"; // Assuming you have this action

const DeliveryForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { items, total } = useSelector((state) => state.cart);

    // Form state
    const [loading, setLoading] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [useSavedAddress, setUseSavedAddress] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        altMobile: "",
        flatBuilding: "",
        area: "",
        landmark: "",
        zipcode: "",
        city: "",
        state: "",
        deliveryInstructions: "",
        paymentMethod: "cod"
    });

    // Fetch user's saved addresses on component mount
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        // Check if cart is empty
        if (items.length === 0) {
            toast.error("Your cart is empty. Please add items before checkout.");
            navigate('/cart');
            return;
        }

        const fetchAddresses = async () => {
            try {
                setLoading(true);
                const response = await api.get('/users/profile');
                console.log("User profile data:", response.data); // Debug log
                
                // First check if user data exists
                if (!response.data || !response.data.user) {
                    console.error("No user data returned from API");
                    toast.error("Could not load user profile");
                    return;
                }
                
                const userData = response.data.user;
                
                // Check if addresses array exists
                let userAddresses = [];
                if (userData.addresses && Array.isArray(userData.addresses) && userData.addresses.length > 0) {
                    userAddresses = userData.addresses;
                    console.log("Found user addresses:", userAddresses); // Debug log
                    setSavedAddresses(userAddresses);
                    
                    // Pre-fill form with user info
                    setFormData(prev => ({
                        ...prev,
                        name: userData.name?.firstName 
                            ? `${userData.name.firstName} ${userData.name.lastName || ''}`
                            : (userData.name || "")
                    }));

                    // Select the first address by default
                    const firstAddress = userAddresses[0];
                    setSelectedAddressId(firstAddress._id);
                    setUseSavedAddress(true);
                    populateFormWithAddress(firstAddress);
                } else {
                    console.log("No saved addresses found for user");
                    // Pre-fill form with just user name if available
                    if (userData.name) {
                        setFormData(prev => ({
                            ...prev,
                            name: userData.name?.firstName 
                                ? `${userData.name.firstName} ${userData.name.lastName || ''}`
                                : userData.name
                        }));
                    }
                    
                    // If user has a phone number, populate that too
                    if (userData.phone) {
                        setFormData(prev => ({
                            ...prev,
                            mobile: userData.phone
                        }));
                    }
                }
            } catch (error) {
                console.error("Error fetching addresses:", error);
                toast.error("Failed to load your saved addresses. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchAddresses();
    }, [isAuthenticated, navigate, items.length]);

    // Helper function to populate form with address data
    const populateFormWithAddress = (address) => {
        setFormData(prev => ({
            ...prev,
            mobile: address.mobile || "",
            altMobile: address.altMobile || "",
            flatBuilding: address.flatBuilding || "",
            area: address.area || "",
            landmark: address.landmark || "",
            zipcode: address.zipcode || "",
            city: address.city || "",
            state: address.state || "",
            deliveryInstructions: address.deliveryInstructions || ""
        }));
    };

    // Validate if all required fields are filled
    const isFormValid = () => {
        return (
            formData.name.trim() !== "" &&
            formData.mobile.trim() !== "" &&
            formData.flatBuilding.trim() !== "" &&
            formData.area.trim() !== "" &&
            formData.landmark.trim() !== "" &&
            formData.zipcode.trim() !== "" &&
            formData.city.trim() !== "" &&
            formData.state.trim() !== ""
        );
    };

    const handleAddressSelection = (e) => {
        const selectedId = e.target.value;
        
        if (selectedId === "-1") {
            setUseSavedAddress(false);
            setSelectedAddressId(null);
            // Reset form but keep the name
            const userName = formData.name;
            setFormData({
                name: userName,
                mobile: "",
                altMobile: "",
                flatBuilding: "",
                area: "",
                landmark: "",
                zipcode: "",
                city: "",
                state: "",
                deliveryInstructions: "",
                paymentMethod: formData.paymentMethod // Keep payment method preference
            });
        } else {
            const address = savedAddresses.find(addr => addr._id === selectedId);
            setSelectedAddressId(selectedId);
            setUseSavedAddress(true);
            
            if (address) {
                populateFormWithAddress(address);
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            toast.error("Please log in to proceed with checkout");
            navigate('/login');
            return;
        }
        
        if (items.length === 0) {
            toast.error("Your cart is empty. Please add items before checkout.");
            navigate('/cart');
            return;
        }

        // Validate mobile number
        if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }

        // Validate zipcode
        if (formData.zipcode && !/^\d{6}$/.test(formData.zipcode)) {
            toast.error('Please enter a valid 6-digit pincode');
            return;
        }

        try {
            setLoading(true);
            
            // Format order items for the backend
            const orderItems = items.map(item => ({
                productId: item.productId._id || item.productId, // Handle both object and ID
                quantity: item.quantity,
                price: item.productId.price || 0,
                name: item.productId.name || 'Product'
            }));
            
            // Prepare order data including products
            const orderData = {
                address: {
                    name: formData.name,
                    mobile: formData.mobile,
                    altMobile: formData.altMobile,
                    flatBuilding: formData.flatBuilding,
                    area: formData.area,
                    landmark: formData.landmark,
                    zipcode: formData.zipcode,
                    city: formData.city,
                    state: formData.state,
                    deliveryInstructions: formData.deliveryInstructions
                },
                paymentMethod: formData.paymentMethod,
                saveAddress: !useSavedAddress, // Only save if it's a new address
                useExistingAddress: useSavedAddress, // Flag to indicate using existing address
                addressId: useSavedAddress ? selectedAddressId : null, // Include address ID if using saved address
                orderItems: orderItems, // Add the order items
                orderTotal: total // Include the total amount
            };
            
            // Create the order
            const { data } = await api.post('/users/orders/create', orderData);
            
            if (data.success) {
                // Clear the cart after successful order
                dispatch(clearCart());
                
                toast.success("Order placed successfully!");
                
                // If payment method is COD, navigate to order success page
                if (formData.paymentMethod === "cod") {
                    navigate(`/order-success/${data.order._id}`);
                } 
                // For online payment, navigate to payment page
                else if (formData.paymentMethod === "online") {
                    navigate(`/payment/${data.order._id}`);
                }
            } else {
                toast.error(data.message || "Failed to place order");
            }
        } catch (error) {
            console.error("Order placement error:", error);
            toast.error(error.response?.data?.message || "Failed to place your order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12">
            <div className="max-w-5xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Checkout</h1>
                
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Progress steps */}
                    <div className="bg-gray-50 px-6 py-4">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center">
                                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center">1</div>
                                <div className="ml-2 font-semibold text-blue-600">Cart</div>
                            </div>
                            <div className="w-16 h-1 bg-blue-600 mx-2"></div>
                            <div className="flex items-center">
                                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center">2</div>
                                <div className="ml-2 font-semibold text-blue-600">Delivery</div>
                            </div>
                            <div className="w-16 h-1 bg-gray-300 mx-2"></div>
                            <div className="flex items-center">
                                <div className="bg-gray-300 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center">3</div>
                                <div className="ml-2 text-gray-600">Payment</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Address Form */}
                            <div className="lg:col-span-2">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Delivery Details</h2>
                                
                                {/* Saved Address Selection */}
                                {savedAddresses.length > 0 && (
                                    <div className="mb-8 bg-gray-50 p-5 rounded-lg border border-gray-200">
                                        <h3 className="text-lg font-semibold text-blue-800 mb-4">Delivery Address</h3>
                                        
                                        <div className="space-y-4">
                                            {/* New address option */}
                                            <div 
                                                onClick={() => {
                                                    setUseSavedAddress(false);
                                                    setSelectedAddressId(null);
                                                    // Reset form but keep the name
                                                    const userName = formData.name;
                                                    setFormData({
                                                        name: userName,
                                                        mobile: "",
                                                        altMobile: "",
                                                        flatBuilding: "",
                                                        area: "",
                                                        landmark: "",
                                                        zipcode: "",
                                                        city: "",
                                                        state: "",
                                                        deliveryInstructions: "",
                                                        paymentMethod: formData.paymentMethod // Keep payment method preference
                                                    });
                                                }}
                                                className={`relative p-4 border-2 rounded-lg cursor-pointer ${
                                                    !useSavedAddress 
                                                    ? 'border-blue-500 bg-blue-50' 
                                                    : 'border-gray-200 hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                        !useSavedAddress ? 'border-blue-500' : 'border-gray-400'
                                                    }`}>
                                                        {!useSavedAddress && (
                                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="font-semibold text-gray-800">Add a new address</p>
                                                        <p className="text-sm text-gray-600">Enter your delivery details below</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Saved addresses */}
                                            {savedAddresses.map((addr) => (
                                                <div
                                                    key={addr._id}
                                                    onClick={() => {
                                                        setSelectedAddressId(addr._id);
                                                        setUseSavedAddress(true);
                                                        populateFormWithAddress(addr);
                                                    }}
                                                    className={`relative p-4 border-2 rounded-lg cursor-pointer ${
                                                        useSavedAddress && selectedAddressId === addr._id
                                                        ? 'border-blue-500 bg-blue-50' 
                                                        : 'border-gray-200 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="flex items-start">
                                                        <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                                            useSavedAddress && selectedAddressId === addr._id 
                                                            ? 'border-blue-500' 
                                                            : 'border-gray-400'
                                                        }`}>
                                                            {useSavedAddress && selectedAddressId === addr._id && (
                                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="ml-3 flex-1">
                                                            <div className="flex justify-between">
                                                                <p className="font-semibold text-gray-800">{addr.name || formData.name}</p>
                                                                {addr.mobile && (
                                                                    <p className="text-sm text-gray-700">{addr.mobile}</p>
                                                                )}
                                                            </div>
                                                            <p className="text-gray-700 mt-1">{addr.flatBuilding}</p>
                                                            <p className="text-gray-700">{addr.area}, {addr.landmark}</p>
                                                            <p className="text-gray-700">{addr.city}, {addr.state} - {addr.zipcode}</p>
                                                            
                                                            {addr.deliveryInstructions && (
                                                                <p className="text-sm text-gray-600 mt-2 italic">
                                                                    Note: {addr.deliveryInstructions}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Title for the form section based on whether using saved address */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {useSavedAddress 
                                            ? 'Review or Update Delivery Information' 
                                            : 'Enter Delivery Information'}
                                    </h3>
                                    
                                    {useSavedAddress && (
                                        <p className="text-sm text-green-600 mt-1">
                                            Using saved address. You can modify any details if needed.
                                        </p>
                                    )}
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">Full Name:</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your full name"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Mobile Numbers */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1">Mobile Number:</label>
                                            <input
                                                type="tel"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleChange}
                                                required
                                                pattern="[0-9]{10}"
                                                maxLength="10"
                                                placeholder="Enter 10-digit mobile number"
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1">Alternate Mobile (Optional):</label>
                                            <input
                                                type="tel"
                                                name="altMobile"
                                                value={formData.altMobile}
                                                onChange={handleChange}
                                                pattern="[0-9]{10}"
                                                maxLength="10"
                                                placeholder="Enter alternate number"
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Address Fields */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">Flat / Building / House:</label>
                                        <input
                                            type="text"
                                            name="flatBuilding"
                                            value={formData.flatBuilding}
                                            onChange={handleChange}
                                            required
                                            placeholder="Flat number, building name, house number"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    {/* Area/Locality field */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">Area / Locality:</label>
                                        <input
                                            type="text"
                                            name="area"
                                            value={formData.area}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your area, colony or locality name"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">Landmark:</label>
                                        <input
                                            type="text"
                                            name="landmark"
                                            value={formData.landmark}
                                            onChange={handleChange}
                                            required
                                            placeholder="Nearby landmark for easy delivery"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Zipcode, City, State */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1">Zipcode:</label>
                                            <input
                                                type="text"
                                                name="zipcode"
                                                value={formData.zipcode}
                                                onChange={handleChange}
                                                required
                                                pattern="[0-9]{6}"
                                                maxLength="6"
                                                placeholder="6-digit pincode"
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1">City:</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter city"
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1">State:</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter state"
                                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Delivery Instructions */}
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">Delivery Instructions (Optional):</label>
                                        <textarea
                                            name="deliveryInstructions"
                                            value={formData.deliveryInstructions}
                                            onChange={handleChange}
                                            placeholder="Any special instructions for delivery"
                                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                                        ></textarea>
                                    </div>

                                    {/* Save Address Option (only show if entering a new address) */}
                                    {!useSavedAddress && (
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="saveAddress"
                                                checked={true}
                                                disabled={true}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label htmlFor="saveAddress" className="ml-2 text-gray-700">
                                                Save this address for future orders
                                            </label>
                                        </div>
                                    )}

                                    {/* Payment Method */}
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
                                        <div className="space-y-3">
                                            <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="cod"
                                                    checked={formData.paymentMethod === "cod"}
                                                    onChange={handleChange}
                                                    className="h-5 w-5 text-blue-600"
                                                />
                                                <div>
                                                    <p className="font-medium">Cash on Delivery</p>
                                                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                                                </div>
                                            </label>
                                            <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="online"
                                                    checked={formData.paymentMethod === "online"}
                                                    onChange={handleChange}
                                                    className="h-5 w-5 text-blue-600"
                                                />
                                                <div>
                                                    <p className="font-medium">Online Payment</p>
                                                    <p className="text-sm text-gray-500">Pay securely with credit/debit card</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                    <h3 className="text-lg font-bold mb-4">Order Summary</h3>
                                    
                                    <div className="space-y-3 mb-4">
                                        {items.map((item, index) => {
                                            const product = item.productId;
                                            const price = product?.price || 0;
                                            
                                            return (
                                                <div key={index} className="flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        <span className="font-medium">
                                                            {product?.name || "Product"} × {item.quantity}
                                                        </span>
                                                    </div>
                                                    <span>₹{(price * item.quantity).toFixed(2)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    <div className="border-t border-gray-200 pt-4 space-y-2">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>₹{total.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping:</span>
                                            <span className="text-green-600">Free</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2">
                                            <span>Total:</span>
                                            <span>₹{total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!isFormValid() || loading}
                                    className={`w-full mt-4 p-4 rounded-md text-white text-lg font-bold ${
                                        !isFormValid() || loading ? 
                                        "bg-gray-400 cursor-not-allowed" : 
                                        "bg-blue-600 hover:bg-blue-700"
                                    }`}
                                >
                                    {loading ? "Processing..." : "Place Order"}
                                </button>
                                
                                <button
                                    onClick={() => navigate('/cart')}
                                    className="w-full mt-3 p-3 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
                                >
                                    Return to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryForm;
