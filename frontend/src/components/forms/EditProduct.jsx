import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, updateProduct } from "../../store/slices/productSlice";

const EditProduct = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Debug logging
    useEffect(() => {
        console.log('Route params:', { id });
        console.log('Location state:', location.state);
    }, [id, location]);

    // redirect if no ID
    useEffect(() => {
        if (!id) {
            console.error('No product ID in URL');
            navigate('/products');
        }
    }, [id, navigate]);

    const { currentProduct, loading, error } = useSelector((state) => state.products);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        manufacturer: '',
        expiryDate: '',
        images: null,  // Only keep this for file upload
        caption: '',
        discount: 0,
        ingredients: '',
        howToUse: '',
        isActive: true
    });

    // Category options based on the schema
    const categoryOptions = [
        'tablets', 
        'capsules', 
        'syrups', 
        'spraies', 
        'ointments', 
        'hair-and-skinCare',
        'others'
    ];

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
        }
    }, [dispatch, id]);

    // Format date string for input element
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        
        // If it's already in YYYY-MM-DD format, return as is
        if (/^\d{4}-\d{2}-\d{2}/.test(dateString)) return dateString;
        
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];  // Format as YYYY-MM-DD
        } catch (e) {
            console.error('Error formatting date:', e);
            return '';
        }
    };

    useEffect(() => {
        if (currentProduct) {
            setFormData({
                name: currentProduct.name || '',
                description: currentProduct.description || '',
                price: currentProduct.price || '',
                stock: currentProduct.stock || '',
                category: currentProduct.category || '',
                manufacturer: currentProduct.manufacturer || '',
                expiryDate: formatDateForInput(currentProduct.expiryDate),
                images: null, // Reset image field
                caption: currentProduct.caption || '',
                discount: currentProduct.discount || 0,
                ingredients: currentProduct.ingredients || '',
                howToUse: currentProduct.howToUse || '',
                isActive: currentProduct.isActive !== false // Default to true if not specified
            });
        }
    }, [currentProduct]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        
        // Append all text fields
        Object.keys(formData).forEach(key => {
            if (key !== 'images') {
                formDataToSend.append(key, formData[key]);
            }
        });

        // Append image if selected
        if (formData.images) {
            formDataToSend.append('images', formData.images);
        }

        try {
            console.log('Submitting update with:', {
                id,
                formData: Object.fromEntries(formDataToSend)
            });

            await dispatch(updateProduct({
                id,
                formData: formDataToSend
            })).unwrap();
            
            navigate(`/product/${id}`);
        } catch (err) {
            console.error('Failed to update product:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] : 
                    type === 'checkbox' ? checked : value
        }));
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>;
    
    if (error) return <div className="min-h-screen flex items-center justify-center">
        <div className="text-blue-500 font-semibold">{error}</div>
    </div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-3xl space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Edit Product Details
                </h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name*</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description*</label>
                        <textarea
                            name="description"
                            rows={4}
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Price and Stock */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price*</label>
                            <input
                                type="number"
                                name="price"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stock*</label>
                            <input
                                type="number"
                                name="stock"
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category*</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select a category</option>
                            {categoryOptions.map((category) => (
                                <option key={category} value={category}>
                                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' & ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Caption */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Caption*</label>
                        <input
                            type="text"
                            name="caption"
                            value={formData.caption}
                            onChange={handleChange}
                            placeholder="Brief product caption"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Manufacturer */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Manufacturer*</label>
                        <input
                            type="text"
                            name="manufacturer"
                            value={formData.manufacturer}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Expiry Date*</label>
                        <input
                            type="date"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Discount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                        <input
                            type="number"
                            name="discount"
                            min="0"
                            max="100"
                            value={formData.discount}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    {/* Ingredients */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ingredients*</label>
                        <textarea
                            name="ingredients"
                            rows={3}
                            value={formData.ingredients}
                            onChange={handleChange}
                            placeholder="List of key ingredients"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* How To Use */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">How To Use*</label>
                        <textarea
                            name="howToUse"
                            rows={3}
                            value={formData.howToUse}
                            onChange={handleChange}
                            placeholder="Instructions for usage"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Image</label>
                        {currentProduct?.images && (
                            <div className="mt-1 mb-2">
                                <p className="text-xs text-gray-500">Current image:</p>
                                <img 
                                    src={currentProduct.images} 
                                    alt={currentProduct.name} 
                                    className="h-24 w-auto object-cover rounded-md"
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            name="images"
                            accept="image/*"
                            onChange={handleChange}
                            className="mt-1 block w-full text-sm text-gray-500 
                                file:mr-4 file:py-2 file:px-4 file:rounded-md 
                                file:border-0 file:text-sm file:font-semibold 
                                file:bg-blue-50 file:text-blue-700 
                                hover:file:bg-blue-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.images ? 'New image selected' : 'Leave empty to keep current image'}
                        </p>
                    </div>

                    {/* IsActive Toggle */}
                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id="isActive"
                                name="isActive"
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="isActive" className="font-medium text-gray-700">Active product</label>
                            <p className="text-gray-500">Product will be available for purchase</p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between gap-4 mt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/products')}
                            className="w-1/2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-1/2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900 disabled:bg-gray-400"
                        >
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
