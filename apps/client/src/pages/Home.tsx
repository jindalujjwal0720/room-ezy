import { useState } from 'react';
import { cn } from '../lib/utils';

import { useGetBuildingsQuery } from '../api/building';
import { useGetBlocksQuery } from '../api/block';
import { useGetFloorsQuery } from '../api/floor';
import FloorPreview from '../components/home/FloorPreview';
import Header from '../components/home/Header';

interface Building {
  _id: string;
  name: string;
}

interface Block {
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
  const { data: { buildings = [] } = {} } = useGetBuildingsQuery<{
    data: { buildings: Building[] };
    isLoading: boolean;
  }>({});
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );

  const { data: { blocks = [] } = {} } = useGetBlocksQuery<{
    data: { blocks: Block[] };
    isLoading: boolean;
  }>(selectedBuilding?._id, {
    skip: !selectedBuilding,
  });
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  const { data: { floors = [] } = {} } = useGetFloorsQuery<{
    data: { floors: Floor[] };
    isLoading: boolean;
  }>(selectedBlock?._id, {
    skip: !selectedBlock,
  });
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);

  return (
    <>
      <Header />
      <div className="p-4">
        <h1 className="font-semibold">Buildings</h1>
        <div className="flex flex-wrap gap-4 mt-4">
          {buildings.map((building) => (
            <div
              key={building._id}
              className={cn(
                'text-sm px-4 py-2 ring-1 ring-muted rounded-md hover:bg-muted cursor-pointer',
                selectedBuilding?._id === building._id && 'ring-primary'
              )}
              onClick={() => {
                setSelectedBuilding(building);
                setSelectedBlock(null);
                setSelectedFloor(null);
              }}
            >
              {building.name}
            </div>
          ))}
        </div>
        {selectedBuilding ? (
          <div className="mt-4">
            <h2 className="font-semibold">Blocks</h2>
            <div className="flex flex-wrap gap-4 mt-4">
              {blocks.map((block) => (
                <div
                  key={block._id}
                  className={cn(
                    'text-sm px-4 py-2 ring-1 ring-muted rounded-md hover:bg-muted cursor-pointer',
                    selectedBlock?._id === block._id && 'ring-primary'
                  )}
                  onClick={() => {
                    setSelectedBlock(block);
                    setSelectedFloor(null);
                  }}
                >
                  {block.name}
                </div>
              ))}
            </div>
            {selectedBlock ? (
              <div className="mt-4">
                <h2 className="font-semibold">Floors</h2>
                <div className="flex flex-wrap gap-4 mt-4">
                  {floors.map((floor) => (
                    <div
                      key={floor._id}
                      className={cn(
                        'text-sm px-4 py-2 ring-1 ring-muted rounded-md hover:bg-muted cursor-pointer',
                        selectedFloor?._id === floor._id && 'ring-primary'
                      )}
                      onClick={() => setSelectedFloor(floor)}
                    >
                      {floor.name}
                    </div>
                  ))}
                </div>
                {selectedFloor ? (
                  <>
                    <h2 className="font-semibold mt-4">Floor preview</h2>
                    <FloorPreview
                      key={selectedFloor?._id}
                      floor={selectedFloor}
                    />
                  </>
                ) : (
                  <div className="mt-4">
                    <h2 className="text-sm text-muted-foreground">
                      Select a floor to view the preview
                    </h2>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4">
                <h2 className="text-sm text-muted-foreground">
                  Select a block to view floors
                </h2>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4">
            <h2 className="text-sm text-muted-foreground">
              Select a building to view blocks
            </h2>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
