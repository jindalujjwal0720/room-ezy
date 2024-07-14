import { useDispatch, useSelector } from 'react-redux';
import {
  selectAdminFloorHistory,
  setAdminFloorHistory,
} from '../../store/slices/history';
import { useState } from 'react';
import Blocks from '../../components/common/Blocks';
import Buildings from '../../components/common/Buildings';
import Floors from '../../components/common/Floors';
import FloorPreview from '../../components/home/FloorPreview';

interface Building {
  _id: string;
  name: string;
}

interface BuildingBlock {
  _id: string;
  name: string;
}

interface Floor {
  _id: string;
  name: string;
  mapType: string;
  namingConvention: string;
  roomsCount: number;
  roomCapacity: number;
}

const FloorsPage = () => {
  const dispatch = useDispatch();
  const floorHistory = useSelector(selectAdminFloorHistory);

  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    floorHistory.selectedBuilding || null
  );
  const [selectedBlock, setSelectedBlock] = useState<BuildingBlock | null>(
    floorHistory.selectedBlock || null
  );
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(
    floorHistory.selectedFloor || null
  );

  return (
    <div className="p-4 flex flex-col gap-4">
      <Buildings
        selectedBuilding={selectedBuilding}
        onSelect={(building) => {
          setSelectedBuilding(building);
          dispatch(
            setAdminFloorHistory({
              selectedBuilding: building,
              selectedBlock: null,
              selectedFloor: null,
            })
          );
        }}
        showForms={false}
      />
      {selectedBuilding && (
        <Blocks
          selectedBuilding={selectedBuilding}
          selectedBlock={selectedBlock}
          onSelect={(BuildingBlock) => {
            setSelectedBlock(BuildingBlock);
            setSelectedFloor(null);
            dispatch(
              setAdminFloorHistory({
                selectedBuilding: selectedBuilding,
                selectedBlock: BuildingBlock,
                selectedFloor: null,
              })
            );
          }}
          showForms={false}
        />
      )}
      {selectedBlock && (
        <Floors
          selectedBlock={selectedBlock}
          selectedFloor={selectedFloor}
          onSelect={(floor) => {
            setSelectedFloor(floor);
            dispatch(
              setAdminFloorHistory({
                selectedBuilding: selectedBuilding,
                selectedBlock: selectedBlock,
                selectedFloor: floor,
              })
            );
          }}
        />
      )}
      {selectedFloor && <FloorPreview floor={selectedFloor} />}
    </div>
  );
};

export default FloorsPage;
