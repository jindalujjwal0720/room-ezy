import { Route, Routes } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/home/Header';
import BuildingsPage from './admin/Buildings';
import BlocksPage from './admin/Blocks';
import FloorsPage from './admin/Floors';
import ActionsPage from './admin/Actions';

const Admin = () => {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<ActionsPage />} />
            <Route path="buildings" element={<BuildingsPage />} />
            <Route path="blocks" element={<BlocksPage />} />
            <Route path="floors" element={<FloorsPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
