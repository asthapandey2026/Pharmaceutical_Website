import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, fetchProducts, deleteProduct } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import EnquiryButton from '../components/EnquiryButton';
import EnquiryPopup from '../components/EnquiryPopup';
import { addToCart } from '../store/slices/cartSlice';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {isAuthenticated, userRole} = useSelector((state) => state.auth);
    const {
        currentProduct,
        products,
        loading,
        error
    } = useSelector((state) => state.products);

   let currentProductIs = currentProduct;
    
    const [showFullScreen, setShowFullScreen] = useState(false);
    // const [isEditing, setIsEditing] = useState(false);
    const [editedProduct, setEditedProduct] = useState(null);
    const [showStickyBar, setShowStickyBar] = useState(false);
    useEffect(() => {
        dispatch(fetchProductById(id));
        dispatch(fetchProducts());

        const handleScroll = () => {
            const productContainer = document.getElementById('product-container');
            if (productContainer) {
                const rect = productContainer.getBoundingClientRect();
                setShowStickyBar(rect.bottom < 0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [dispatch, id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching product with ID:', id);
                await dispatch(fetchProductById(id)).unwrap();
                await dispatch(fetchProducts()).unwrap();
            } catch (err) {
                console.error('Error fetching product:', err);
            }
        };

        fetchData();
    }, [dispatch, id]);

    useEffect(() => {
        if (currentProduct && !editedProduct) {
            setEditedProduct(currentProduct);
        }
    }, [currentProduct]);

    // Debug logging
    useEffect(() => {
        // console.log('Current Product State:', { currentProduct, loading, error });
    }, [currentProduct, loading, error]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>;
    }

    if (error || !currentProduct) {
        return <p className="text-center text-xl font-bold text-blue-500">
            {error || 'Product not found.'}
        </p>;
    }

    const frequentlyBoughtTogether = products
        ?.filter(p => p._id !== id)
        ?.slice(0, 4) || [];


    const handleAddToCart = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        try {
            // Here's the fix - use the redux thunk to ensure backend sync
            await dispatch(addToCart({
                productId: currentProductIs._id,
                quantity: 1 // Or whatever quantity you want to add
            })).unwrap();
            
            toast.success("Product added to cart!");
        } catch (error) {
            toast.error(error || "Failed to add product to cart");
        }
    };

    const handleEditProduct = () => {
        if (!currentProduct?._id) {
            console.error('No product ID available');
            return;
        }
        // Use navigate with state
        navigate(`/editProduct/${currentProduct._id}`, {
            state: { product: currentProduct }
        });
    };

    const handleDeleteProduct = async (e) => {
        e.preventDefault();
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await dispatch(deleteProduct(currentProduct._id)).unwrap();
                navigate('/products');
            } catch (err) {
                console.error('Failed to delete product:', err);
            }
        }
    };

    return (
        <div className="flex-row">
            {/* Main Product Details */}
            <div id="product-container" className="pt-16 pb-4 bg-gray-100">
                <div className="bg-white shadow-md p-6 rounded-lg">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6">
                        <div className="flex flex-col lg:flex-row w-full gap-6">
                            {/* Product Image */}
                            <div className="w-full lg:w-2/5 flex justify-center">
                                <img
                                    src={currentProduct.images}
                                    alt={currentProduct.name}
                                    className="max-w-[350px] h-auto rounded-lg shadow-lg cursor-pointer"
                                    onClick={() => setShowFullScreen(true)}
                                />
                            </div>
                            {/* Full-Screen Image Modal */}
                            {showFullScreen && (
                                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={() => setShowFullScreen(false)}>
                                    <img src={currentProduct.images} alt={currentProduct.name} className="max-w-full max-h-full rounded-lg shadow-lg" />
                                </div>
                            )}
                            {/* Product Details */}
                            <div className="w-full lg:w-3/5 flex flex-col">
                                <h1 className="mt-10 text-3xl font-bold mb-0 text-gray-800">{currentProduct.name}</h1>
                                <p className="text-gray-600 text-lg mb-4">{currentProduct.caption}</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    ₹{parseInt(currentProduct.price) - ((currentProduct.discount || 10) / 100) * parseInt(currentProduct.price)}
                                    <span className="text-lg text-gray-500 line-through ml-2">₹{currentProduct.price}</span>
                                    <span className="text-green-600 ml-2">({currentProduct.discount || 10}% OFF)</span>
                                </p>
                                <p className="mt-1 text-gray-500">Inclusive of all taxes</p>
                                <p className="mt-3 text-gray-700"><strong>Estimated Delivery:</strong> 8-10 business days</p>
                                <p className="text-gray-700"><strong>Cash on Delivery:</strong> Available</p>

                                {/* Admin Controls */}
                                {userRole === "admin" ? (
                                    <div className="mt-4 flex gap-4">
                                        <button onClick={handleEditProduct} className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors">EDIT PRODUCT</button>
                                        <button onClick={handleDeleteProduct} className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors">DELETE PRODUCT</button>
                                    </div>
                                ) : (
                                    <div className="mt-4 flex gap-4">
                                        <button
                                            onClick={handleAddToCart}
                                            className="px-10 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition-colors"
                                            disabled={loading}>
                                            {loading ? 'Adding...' : 'ADD TO CART'}
                                        </button>
                                    </div>
                                )}
                                <div className='flex mt-3'>
                                    <div className='px-4 mr-4 rounded-sm bg-blue-100 shadow-lg'>
                                        Ships within 1-2 days
                                    </div>
                                    <div className='px-4 rounded-sm bg-blue-100 shadow-lg '>
                                        Shipping Across India
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Product Information */}
                    <div className="mt-6 px-10 sm:px-6 lg:px-24 bg-white shadow-md p-6 rounded-lg">
                        {/* Product Description */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Description</h2>
                            <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                                {currentProduct.description || 'No additional description available.'}
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ingredients</h2>
                            <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                                {currentProduct.ingredients || 'Information not available.'}
                            </div>
                        </div>

                        {/* How to Use */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Use</h2>
                            <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                                {currentProduct.howToUse || 'Information not available.'}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Frequently Bought Together */}
            <div className="mt-10 px-8 sm:px-12">
                <h2 className="text-2xl font-bold text-gray-800">Frequently Bought Together</h2>
                <div className="relative mt-6">
                    <div className="flex gap-6 overflow-x-auto hide-scrollbar whitespace-nowrap">
                        {frequentlyBoughtTogether.map(product => (
                            <div key={product._id} className="min-w-[280px] max-w-[280px] ">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Bar */}
            {showStickyBar && (
                <div className="fixed bottom-0 left-0 w-full bg-blue-50 shadow-lg py-4 px-20 flex items-center justify-between z-50">
                    {/* Product Details - Hidden on Small Screens */}
                    <div className="hidden md:flex items-center gap-3">
                        <img
                            src={currentProduct.images}
                            alt={currentProduct.name}
                            className="w-14 h-14 rounded-md object-cover"
                        />
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">{currentProduct.name}</h2>
                            <p className="text-sm font-medium text-gray-600">
                                ₹
                                {parseInt(currentProduct.price) -
                                    ((currentProduct.discount || 10) / 100) *
                                    parseInt(currentProduct.price)}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 w-full md:w-auto justify-center">
                        {userRole === "admin" ? (
                            <>
                                <button
                                    onClick={handleEditProduct}
                                    className="w-full md:w-auto lg:w-[180px] px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                                >
                                    <span className="inline-block md:hidden px-4">EDIT</span>
                                    <span className=" hidden md:inline-block ">EDIT PRODUCT</span>
                                </button>
                                <button
                                    onClick={handleDeleteProduct}
                                    className="w-full md:w-auto lg:w-[180px] px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                                >
                                    <span className="inline-block md:hidden px-2">DELETE</span>
                                    <span className="hidden md:inline-block ">DELETE PRODUCT</span>
                                </button>
                            </>
                        ) : (
                            <button
                                className="w-full md:w-60 lg:w-80 py-3 bg-blue-800 text-white font-semibold rounded-full hover:bg-blue-900 transition shadow-md"
                            >
                                ADD TO CART
                            </button>
                        )}
                    </div>
                </div>
            )}

            <EnquiryButton />
            <EnquiryPopup />

            {/* Hide Scrollbar CSS */}
            <style>
                {`
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                `}
            </style>
        </div >
    );
};

export default ProductDetails;
