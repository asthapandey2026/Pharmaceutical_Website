import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, loading: authLoading } = useSelector((state) => state.auth);
    const { loading: cartLoading } = useSelector((state) => state.cart);

    const handleClick = () => {
        navigate(`/product/${product._id}`);
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation(); // Prevent navigation
        
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        try {
            // Add to cart with productId and quantity
            await dispatch(addToCart({
                productId: product._id,
                quantity: 1
            })).unwrap();
            
            toast.success(`${product.name} added to cart!`);
        } catch (error) {
            toast.error(error || 'Failed to add to cart');
        }
    };

    // Calculate discounted price
    const discountedPrice = product.price - ((product.dis || 10) / 100) * product.price;

    return (
        <div
            onClick={handleClick}
            className="cursor-pointer max-w-sm bg-white border border-gray-300 rounded-lg shadow-md m-2 p-4 hover:shadow-lg transition-shadow duration-300"
        >
            <img
                src={product.images}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
            />

            <div className="mt-3 space-y-2">
                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                <p className="text-sm text-gray-600 line-clamp-2">{product.caption}</p>

                <p className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-md inline-block font-medium">
                    Pharmaceuticals
                </p>

                {/* Price */}
                <p className="text-lg font-bold text-gray-900">
                    ₹{(parseInt(product.price) - ((product.discount||10) / 100) * parseInt(product.price)).toFixed(2)}
                    <br /><span className="text-sm text-gray-500 line-through mr-1">₹{product.price}</span>
                    <span className="text-blue-600 text-sm font-semibold ml-1">({product.discount || 10}% OFF)</span>
                </p>

                <button
                    onClick={handleAddToCart}
                    disabled={authLoading || cartLoading}
                    className="w-full py-2 bg-blue-900 text-white hover:bg-blue-950 rounded-md font-bold text-sm transition-all disabled:opacity-70"
                >
                    {cartLoading ? 'Adding...' : isAuthenticated ? 'ADD TO CART' : 'LOGIN TO ADD'}
                </button>
                {/* {renderButtons()} */}
            </div>
        </div>
    );
};

export default ProductCard;
