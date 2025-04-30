import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshToken, persistLogin } from '../store/slices/authSlice';

const AuthPersist = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        if (isAuthenticated) {
          // If already authenticated from persisted state, just verify the token
          await dispatch(refreshToken()).unwrap();
        } else {
          // Otherwise just mark as not loading
          dispatch(persistLogin());
        }
      } catch (err) {
        console.error('Failed to refresh token:', err);
      } finally {
        setIsLoading(false);
      }
    };

    verifyRefreshToken();
  }, [dispatch, isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return children;
};

export default AuthPersist;
