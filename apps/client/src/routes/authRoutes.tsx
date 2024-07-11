import LoginPage from '../pages/auth/Login';
import { Route, Routes } from 'react-router-dom';
import VerifyLoginOTP from '../pages/auth/VerifyLoginOTP';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="verify-login-otp" element={<VerifyLoginOTP />} />
    </Routes>
  );
};

export default AuthRoutes;
