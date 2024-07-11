import { Route, Routes } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Header from '../components/home/Header';
import Buildings from '../components/admin/Buildings';
import Blocks from '../components/admin/Blocks';
import Floors from '../components/admin/Floors';
import FloorPreview from '../components/home/FloorPreview';

const Admin = () => {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<FloorPreview floor={null} />} />
            <Route path="buildings" element={<Buildings />} />
            <Route path="blocks" element={<Blocks />} />
            <Route path="floors" element={<Floors />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
