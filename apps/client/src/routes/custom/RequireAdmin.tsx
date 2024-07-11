import { selectIsAdmin } from '../../store/slices/auth';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const RequireAdmin = () => {
    const isAdmin = useSelector(selectIsAdmin);

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default RequireAdmin;
