import { useDispatch, useSelector } from 'react-redux';
import { selectHomeHistory, setHomeHistory } from '../store/slices/history';
import { useState } from 'react';
import Blocks from '../components/common/Blocks';
import Buildings from '../components/common/Buildings';
import Floors from '../components/common/Floors';
import FloorPreview from '../components/home/FloorPreview';
import Header from '../components/home/Header';

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

const Home = () => {
  const dispatch = useDispatch();
  const homeHistory = useSelector(selectHomeHistory);

  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    homeHistory.selectedBuilding || null
  );
  const [selectedBlock, setSelectedBlock] = useState<BuildingBlock | null>(
    homeHistory.selectedBlock || null
  );
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(
    homeHistory.selectedFloor || null
  );

  return (
    <>
      <Header />
      <div className="p-4 flex flex-col gap-4">
        <Buildings
          selectedBuilding={selectedBuilding}
          onSelect={(building) => {
            setSelectedBuilding(building);
            dispatch(
              setHomeHistory({
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
            onSelect={(block) => {
              setSelectedBlock(block);
              dispatch(
                setHomeHistory({
                  selectedBuilding: selectedBuilding,
                  selectedBlock: block,
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
                setHomeHistory({
                  selectedBuilding: selectedBuilding,
                  selectedBlock: selectedBlock,
                  selectedFloor: floor,
                })
              );
            }}
            showForms={false}
          />
        )}
        {selectedFloor && <FloorPreview floor={selectedFloor} />}
      </div>
    </>
  );
};

export default Home;
