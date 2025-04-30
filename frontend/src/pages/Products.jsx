import  { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import EnquiryButton from '../components/EnquiryButton';
import EnquiryPopup from '../components/EnquiryPopup';
import { fetchProducts } from '../store/slices/productSlice';
import { useNavigate } from 'react-router-dom';

function Products() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products, loading, error } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);
    const userRole = user?.user?.role || user?.role;

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-blue-500">
                Error: {error}
            </div>
        );
    }

    const handleAddProduct = () => {
        navigate('/addProduct');
    };

    const handleViewInactiveProducts = () => {
        navigate('/inactive-products');
    };

    return (
        <div className="min-h-screen pt-16 pb-8">
            <div className="max-w-9xl mx-auto px-5 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mt-8 mb-3">
                    <h1 className="text-4xl font-bold my-8 mx-7">Products</h1>
                    {userRole === 'admin' && (
                        <div className="flex space-x-4">
                            <button
                                onClick={handleViewInactiveProducts}
                                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                            >
                                INACTIVE PRODUCTS
                            </button>
                            <button
                                onClick={handleAddProduct}
                                className="px-6 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900"
                            >
                                ADD PRODUCT
                            </button>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto px-4">
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
            <div>
                <EnquiryButton />
                <EnquiryPopup />
            </div>
        </div>
    );
}

export default Products;
