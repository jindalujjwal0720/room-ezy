import { useDispatch, useSelector } from 'react-redux';
import {
  selectAdminBlockHistory,
  setAdminBlockHistory,
} from '../../store/slices/history';
import { useState } from 'react';
import Blocks from '../../components/common/Blocks';
import Buildings from '../../components/common/Buildings';

interface Building {
  _id: string;
  name: string;
}

interface BuildingBlock {
  _id: string;
  name: string;
}

const BlocksPage = () => {
  const dispatch = useDispatch();
  const blockHistory = useSelector(selectAdminBlockHistory);

  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    blockHistory.selectedBuilding || null
  );
  const [selectedBlock, setSelectedBlock] = useState<BuildingBlock | null>(
    blockHistory.selectedBlock || null
  );

  return (
    <div className="p-4 flex flex-col gap-4">
      <Buildings
        selectedBuilding={selectedBuilding}
        onSelect={(building) => {
          setSelectedBuilding(building);
          dispatch(
            setAdminBlockHistory({
              selectedBuilding: building,
              selectedBlock: null,
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
              setAdminBlockHistory({
                selectedBuilding: selectedBuilding,
                selectedBlock: block,
              })
            );
          }}
        />
      )}
    </div>
  );
};

export default BlocksPage;
