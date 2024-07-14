import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import LoadingHeader from '../components/LoadingHeader';
import Loading from '../components/Loading';

const Header = lazy(() => import('../components/home/Header'));
const ActionsPage = lazy(() => import('./admin/Actions'));
const BuildingsPage = lazy(() => import('./admin/Buildings'));
const BlocksPage = lazy(() => import('./admin/Blocks'));
const FloorsPage = lazy(() => import('./admin/Floors'));

const Admin = () => {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<LoadingHeader />}>
        <Header />
      </Suspense>
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1">
          <Suspense fallback={<Loading full />}>
            <Routes>
              <Route path="/" element={<ActionsPage />} />
              <Route path="buildings" element={<BuildingsPage />} />
              <Route path="blocks" element={<BlocksPage />} />
              <Route path="floors" element={<FloorsPage />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Admin;
