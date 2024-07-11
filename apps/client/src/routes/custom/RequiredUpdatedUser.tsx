import { selectIsProfileUpdated } from '../../store/slices/auth';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const RequireUpdatedUser = () => {
  const isUserUpdated = useSelector(selectIsProfileUpdated);

  if (!isUserUpdated) {
    return <Navigate to="/update-user" />;
  }

  return <Outlet />;
};

export default RequireUpdatedUser;
