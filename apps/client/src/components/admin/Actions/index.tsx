import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  selectAdminActionsHistory,
  setAdminActionsHistory,
} from '../../../store/slices/history';
import PredictAllocation from './PredictAllocation';
import AllocateRooms from './AllocateRooms';
import DownloadCSV from './DownloadCSV';
import ClearAllotments from './ClearAllotments';
import ResetBuilding from './ResetBuilding';
import Buildings from '../../common/Buildings';

interface Building {
  _id: string;
  name: string;
}

const Actions = () => {
  const dispatch = useDispatch();
  const actionsHistory = useSelector(selectAdminActionsHistory);

  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    actionsHistory.selectedBuilding || null
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="font-semibold">Actions</h1>
        <p className="text-muted-foreground text-sm">
          Here you can perform various actions like room allocation, etc. Note
          that some of these actions are <strong>irreversible</strong>.
        </p>
      </div>
      <Buildings
        heading={false}
        selectedBuilding={selectedBuilding}
        onSelect={(building) => {
          setSelectedBuilding(building);
          dispatch(setAdminActionsHistory({ selectedBuilding: building }));
        }}
        showForms={false}
      />
      {selectedBuilding ? (
        <div className="mt-4 w-full">
          <div className="gap-4 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <PredictAllocation building={selectedBuilding} />
            <AllocateRooms building={selectedBuilding} />
            <DownloadCSV building={selectedBuilding} />
            <ClearAllotments building={selectedBuilding} />
            <ResetBuilding building={selectedBuilding} />
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-sm text-muted-foreground">
            Select a building to perform actions
          </h2>
        </div>
      )}
    </div>
  );
};

export default Actions;
