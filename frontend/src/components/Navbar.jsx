import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaSearch, FaBars, FaTimes, FaUser } from 'react-icons/fa';
import { logout, fetchUserProfile } from '../store/slices/authSlice';
import api from '../utils/axios';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user, loading  } = useSelector(state => state.auth);
  const userRole = user?.user?.role || user?.role;

  useEffect(() => {
    if (!user && isAuthenticated) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user, isAuthenticated]);

  const { items } = useSelector(state => state.cart);

  const handleLogout = async () => {
    try {
      const { data } = await api.post('/users/logout');

      if (data.success) {
        dispatch(logout());
        navigate('/login');
      } else {
        console.error('Logout failed:', data.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Don't show login/logout buttons while checking auth status
  if (loading) {
    return null;
  }

  const handleCartPage = (() => {
    if (isAuthenticated) {
      navigate('/cart')
    }
    else {
      navigate('/login')
    }
  });


  return (
    <nav className="bg-blue-950 shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="text-3xl font-bold text-blue-100 hidden md:block"><i>Pharmaceuticals</i></div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className=" text-blue-100 hover:text-blue-100">Home</a>
            <a href="/products" className="text-blue-100 hover:text-blue-100">Products</a>
            {isAuthenticated ? (
              <>
                {userRole === 'admin' ? (
                  <a href="/purchaseRequests" className="text-blue-100 hover:text-blue-100">Orders</a>
                ) :
                  <a href="/currentPurchase" className="text-blue-100 hover:text-blue-100">Orders</a>
                }
              </>
            ) :
              (<a href="/login" className="text-blue-100 hover:text-blue-100">Orders</a>)
            }
            <a href="/offers" className="text-blue-100 hover:text-blue-100">Offers</a>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search medicines..."
                className="w-64 px-4 py-1 rounded-full border text-blue-300 focus:outline-none focus:border-blue-200 shadow-md"
              />
              <FaSearch className="absolute right-3 top-2 text-blue-900" />
            </div>
          </div>

          {/* Auth and Cart Icons */}
          <div className="flex items-center space-x-4">
            <button className="relative" onClick={handleCartPage}>
              <FaShoppingCart className="h-6 w-6 text-blue-100 hover:text-blue-100" />
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {items.length}
              </span>
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 text-blue-100 hover:text-blue-100"
                >
                  <FaUser className="h-6 w-6" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Link to="/userProfile" className="block px-4 py-2 text-sm text-blue-950 hover:bg-blue-100">Profile</Link>
                    {userRole === 'admin' ? (
                      <a href="/purchaseRequests" className="block px-4 py-2 text-sm text-blue-950 hover:bg-blue-100">Orders</a>
                    ) :
                      <a href="/currentPurchase" className="block px-4 py-2 text-sm text-blue-950 hover:bg-blue-100">Orders</a>
                    }
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-blue-950 hover:bg-blue-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-blue-100 bg-blue-900 hover:bg-blue-800 hover:text-blue-50 rounded-md"
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FaTimes className="h-6 w-6 text-blue-100" /> : <FaBars className="h-6 w-6 text-blue-100" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/" className="block px-3 py-2 text-blue-100 hover:bg-blue-50 hover:text-blue-950 rounded-md">Home</a>
              <a href="/products" className="block px-3 py-2 text-blue-100 hover:bg-blue-50 hover:text-blue-950 rounded-md">Products</a>
              {isAuthenticated ? (
                <>
                  {userRole === 'admin' ? (
                    <a href="/purchaseRequests" className="block px-3 py-2 text-blue-100 hover:bg-blue-50 hover:text-blue-950 rounded-md">Orders</a>
                  ) :
                    <a href="/currentPurchase" className="block px-3 py-2 text-blue-100 hover:bg-blue-50 hover:text-blue-950 rounded-md">Orders</a>
                  }
                </>
              ) :
                (<a href="/login" className="block px-3 py-2 text-blue-100 hover:bg-blue-50 hover:text-blue-950 rounded-md">Orders</a>)
              }
              <a href="/offers" className="block px-3 py-2 text-blue-100 hover:bg-blue-50 hover:text-blue-950 rounded-md">Offers</a>
              <div className="relative px-3 py-2">
                <input
                  type="text"
                  placeholder="Search medicines..."
                  className="w-full px-4 py-1 text-blue-200 rounded-full border focus:outline-none focus:border-blue-100"
                />
                <FaSearch className="absolute right-6 top-4 text-blue-900" />
              </div>
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-blue-300 hover:bg-blue-50 hover:text-blue-950 rounded-md"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 text-blue-100 bg-blue-900 hover:bg-blue-800 hover:text-blue-50 rounded-md"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
