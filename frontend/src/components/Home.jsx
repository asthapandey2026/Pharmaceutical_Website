import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";
import EnquiryButton from "./EnquiryButton";
import OfferBanner from "./OfferBanner";
import ProductSlider from "./ProductSlider";
import AboutCard from "./AboutCard";
import AboutCompany from "./AboutCompany";

function Home() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const { isAuthenticated } = useSelector((state) => state.auth);

  const fetchUserProfile = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setUserData(null);
      return;
    }

    try {
      const { data } = await api.get("/users/profile");
      setUserData(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [location.key, isAuthenticated]);

  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/products");
  };

  return (
    <div className="min-h-screen pt-16 pb-8">
      {/* Intro Banner Section */}
      <div className="relative w-full h-[250px] md:h-[350px] lg:h-[450px] overflow-hidden">
        <img
          src="/abc.jpg"
          alt="Pharmaceuticals"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Existing Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : userData ? (
          <div className="bg-white shadow rounded-lg p-4 mt-3">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-serif text-center my-6">
              Hello {userData.data.user.name.firstName}! Welcome to Pharmaceuticals...
            </h2>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-blue-950 mb-4">Please log in to view your profile</p>
            <Link
              to="/login"
              className="inline-block bg-blue-900 text-blue-50 px-4 py-2 md:px-6 md:py-3 rounded-md hover:bg-blue-800"
            >
              Login
            </Link>
          </div>
        )}
      </div>

      {/* Best Sellers Section */}
      <div className="max-w-7xl mx-auto my-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 mb-3">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-medium text-left">Best Sellers</h1>
          <button
            onClick={handleClick}
            className="bg-blue-800 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-blue-950 transition"
          >
            VIEW ALL
          </button>
        </div>
        <p className="text-sm md:text-lg">
          Pharmaceuticals is your trusted online Skin and Personal Care Products company for all your Personal and Skincare needs. We provide quality products.
        </p>
      </div>

      {/* OfferBanner + ProductSlider Section */}
      <div className="flex flex-col md:flex-row mx-4 md:mx-10 lg:mx-20 justify-center items-stretch gap-6">
        <div className="w-full md:w-1/3">
          <OfferBanner />
        </div>
        <div className="w-full md:w-2/3">
          <ProductSlider />
        </div>
      </div>

      {/* About section */}
      <div className='mt-6 md:mt-9'>
        <AboutCompany />
      </div>
      <div className="bg-white p-3 mt-6 md:mt-9">
        <div className='min-h-screen'>
          <AboutCard />
        </div>
      </div>

      <div className="mt-6">
        <EnquiryButton />
      </div>
    </div>
  );
}

export default Home;
