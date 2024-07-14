import { useDispatch, useSelector } from 'react-redux';
import Buildings from '../../components/common/Buildings';
import {
  selectAdminBuildingHistory,
  setAdminBuildingHistory,
} from '../../store/slices/history';
import { useState } from 'react';

interface Building {
  _id: string;
  name: string;
}

const BuildingsPage = () => {
  const dispatch = useDispatch();
  const buildingHistory = useSelector(selectAdminBuildingHistory);

  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    buildingHistory.selectedBuilding || null
  );

  return (
    <div className="p-4">
      <Buildings
        selectedBuilding={selectedBuilding}
        onSelect={(building) => {
          setSelectedBuilding(building);
          dispatch(setAdminBuildingHistory({ selectedBuilding: building }));
        }}
      />
    </div>
  );
};

export default BuildingsPage;
