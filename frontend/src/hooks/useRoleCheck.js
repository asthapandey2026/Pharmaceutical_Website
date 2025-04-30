import { useSelector } from 'react-redux';

export const useRoleCheck = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const userRole = user?.user?.role || user?.role;

  return {
    isAuthenticated,
    userRole,
    isAdmin: userRole === 'admin'
  };
};