import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import { fetchProducts } from "../store/slices/productSlice";

const ProductSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(1); // Default to 1 for small screens
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Update visible items based on screen size
  useEffect(() => {
    const updateVisibleItems = () => {
      if (window.innerWidth >= 1024) {
        setVisibleItems(3); // Large screens: 3 items
      } else if (window.innerWidth >= 640) {
        setVisibleItems(2); // Medium screens: 2 items
      } else {
        setVisibleItems(1); // Small screens: 1 item
      }
    };

    updateVisibleItems();
    window.addEventListener("resize", updateVisibleItems);
    return () => window.removeEventListener("resize", updateVisibleItems);
  }, []);



  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!products?.length) {
    return null;
  }

  return (
    <div className="relative w-full flex items-center justify-center mt-6">
      <div className="overflow-hidden w-full max-w-5xl px-4">
        <div
          className=" transition-transform duration-500 ease-in-out flex gap-6 overflow-x-auto hide-scrollbar whitespace-nowrap"
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
          }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              className="min-w-[calc(100%/1)] sm:min-w-[calc(100%/2)] lg:min-w-[calc(100%/3)] p-2"
            >
              <div className="bg-white rounded-md shadow-sm p-3 hover:scale-105 transition-transform">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
      </div>

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
    </div>
  );
};

export default ProductSlider;
