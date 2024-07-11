import { selectIsLoggedIn } from '../../store/slices/auth';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

type AuthLayoutProps = {
  children: JSX.Element;
  redirect?: boolean;
};

const getFilteredFromRoute = (from: string) => {
  const excludedRoutes = ['/a/login', '/a/verify-login-otp'];

  if (excludedRoutes.includes(from)) {
    return '/';
  }

  return from || '/';
};

const AuthLayout = ({ children, redirect = true }: AuthLayoutProps) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const location = useLocation();
  const from = getFilteredFromRoute(location.state?.from as string);

  if (isLoggedIn && redirect) return <Navigate to={from} />;

  return (
    <div className="flex items-center justify-center h-screen">{children}</div>
  );
};

export default AuthLayout;
