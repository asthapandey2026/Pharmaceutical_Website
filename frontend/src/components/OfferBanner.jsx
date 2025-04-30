import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";

function OfferBanner() {
  const { offerBanners = [] } = useSelector((state) => state.banner); // Ensure a default empty array
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    if (offerBanners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % offerBanners.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [offerBanners.length]);

  const prevBanner = () => {
    if (offerBanners.length === 0) return;
    setCurrentBanner((prev) => (prev === 0 ? offerBanners.length - 1 : prev - 1));
  };

  const nextBanner = () => {
    if (offerBanners.length === 0) return;
    setCurrentBanner((prev) => (prev + 1) % offerBanners.length);
  };

  if (offerBanners.length === 0) {
    return <div className="text-center text-gray-500 mt-4">No offers available</div>;
  }

  return (
    <div className="relative max-w-4xl mx-auto mt-6 overflow-hidden">
      <div className="relative w-full h-80">
        <img
          src={offerBanners[currentBanner]}
          alt="Offer Banner"
          className="w-full h-full object-cover rounded-lg shadow-md"
        />

        {/* Left Arrow */}
        <button
          onClick={prevBanner}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-900 text-white p-2 rounded-full"
        >
          <FaChevronLeft/>
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextBanner}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-900 text-white p-2 rounded-full"
        >
          <FaChevronRight/>
        </button>
      </div>
    </div>
  );
}

export default OfferBanner;
