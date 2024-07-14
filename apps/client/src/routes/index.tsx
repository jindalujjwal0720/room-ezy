import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthRoutes from './authRoutes';
import RequireLoggedIn from './custom/RequireLoggedIn';
import RequireUpdatedUser from './custom/RequireUpdatedUser';
import UpdateUser from '../pages/auth/UpdateUser';
import RequireAdmin from './custom/RequireAdmin';
import LoadingPage from '../pages/Loading';

const Home = lazy(() => import('../pages/Home'));
const Admin = lazy(() => import('../pages/Admin'));

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
            <Route
              path="*"
              element={
                <Suspense fallback={<LoadingPage />}>
                  <Admin />
                </Suspense>
              }
            />
          </Route>
          {/* All routes here */}
          <Route
            path="*"
            element={
              <Suspense fallback={<LoadingPage />}>
                <Home />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
};

export default IndexRouter;
