import { Route, Routes } from 'react-router-dom';
import AuthRoutes from './authRoutes';
import RequireLoggedIn from './custom/RequireLoggedIn';
import RequireUpdatedUser from './custom/RequireUpdatedUser';
import UpdateUser from '../pages/auth/UpdateUser';
import Home from '../pages/Home';
import RequireAdmin from './custom/RequireAdmin';
import Admin from '../pages/Admin';

const IndexRouter = () => {
  return (
    <Routes>
      <Route path="/a/*" element={<AuthRoutes />} />
      <Route path="*" element={<RequireLoggedIn />}>
        {/* All logged in routes here */}
        <Route path="update-user" element={<UpdateUser />} />
        <Route path="*" element={<RequireUpdatedUser />}>
          <Route path="admin/*" element={<RequireAdmin />}>
            {/* All admin routes here */}
            <Route path="*" element={<Admin />} />
          </Route>
          {/* All routes here */}
          <Route path="*" element={<Home />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default IndexRouter;
