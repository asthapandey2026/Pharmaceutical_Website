import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaHeadset } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { checkAuthStatus } from "../store/slices/authSlice";
import EnquiryPopup from './EnquiryPopup';

const EnquiryButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const userRole = user?.user?.role || user?.role;

  const handleClick = async () => {
    try {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      const result = await dispatch(checkAuthStatus()).unwrap();
      const currentRole = result?.user?.role || result?.role;

      if (currentRole === 'admin') {
        navigate('/admin/enquiries');
      } else {
        setIsOpen(true); // Changed from setShowPopup to setIsOpen
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      navigate('/login');
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        aria-label={userRole === "admin" ? "Manage enquiries" : "Open chat"}
        title={userRole === "admin" ? "Manage Enquiries" : "Contact Support"}
        className="fixed bottom-6 right-6 bg-blue-900 text-white p-4 rounded-full shadow-lg hover:bg-blue-950 transition duration-300"
      >
        <FaHeadset size={24} />
      </button>

      {userRole !== 'admin' && (
        <EnquiryPopup 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          user={user}
        />
      )}
    </>
  );
};

export default EnquiryButton;
