import { selectIsLoggedIn } from '../../store/slices/auth';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const RequireLoggedIn = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/a/login" />;
  }

  return <Outlet />;
};

export default RequireLoggedIn;
