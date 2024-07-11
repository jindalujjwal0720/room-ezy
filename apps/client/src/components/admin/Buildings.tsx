import { useState } from 'react';
import { cn } from '../../lib/utils';

import { useGetBuildingsQuery } from '../../api/building';

import UpdateBuildingForm from './forms/UpdateBuilding';
import CreateBuildingForm from './forms/CreateBuilding';

interface Building {
  _id: string;
  name: string;
}

const Buildings = () => {
  const { data: { buildings = [] } = {} } = useGetBuildingsQuery<{
    data: { buildings: Building[] };
  }>({});
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );

  return (
    <div className="p-4">
      <h1 className="font-semibold">Buildings</h1>
      <div className="flex flex-wrap gap-4 mt-4">
        <div
          className={cn(
            'text-sm px-4 py-2 ring-1 ring-muted rounded-md hover:bg-muted cursor-pointer',
            !selectedBuilding && 'ring-primary'
          )}
          onClick={() => setSelectedBuilding(null)}
        >
          Add new building
        </div>
        {buildings.map((building) => (
          <div
            key={building._id}
            className={cn(
              'text-sm px-4 py-2 ring-1 ring-muted rounded-md hover:bg-muted cursor-pointer',
              selectedBuilding?._id === building._id && 'ring-primary'
            )}
            onClick={() => setSelectedBuilding(building)}
          >
            {building.name}
          </div>
        ))}
      </div>
      {selectedBuilding ? (
        <div className="mt-4">
          <h2 className="font-semibold">Update building</h2>
          <UpdateBuildingForm
            key={selectedBuilding._id}
            building={selectedBuilding}
            onDelete={() => setSelectedBuilding(null)}
          />
        </div>
      ) : (
        <div className="mt-4">
          <h2 className="font-semibold">Add new building</h2>
          <CreateBuildingForm />
        </div>
      )}
    </div>
  );
};

export default Buildings;
