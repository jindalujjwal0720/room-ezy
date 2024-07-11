import { useState } from 'react';
import { cn } from '../../lib/utils';

import { useGetBuildingsQuery } from '../../api/building';
import { useGetBlocksQuery } from '../../api/block';

import UpdateBlockForm from './forms/UpdateBlock';
import CreateBlocksForm from './forms/CreateBlocks';

interface Building {
  _id: string;
  name: string;
}

interface Block {
  _id: string;
  name: string;
}

const Blocks = () => {
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

  return (
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
            <div
              className={cn(
                'text-sm px-4 py-2 ring-1 ring-muted rounded-md hover:bg-muted cursor-pointer',
                !selectedBlock && 'ring-primary'
              )}
              onClick={() => setSelectedBlock(null)}
            >
              Add new blocks
            </div>
            {blocks.map((block) => (
              <div
                key={block._id}
                className={cn(
                  'text-sm px-4 py-2 ring-1 ring-muted rounded-md hover:bg-muted cursor-pointer',
                  selectedBlock?._id === block._id && 'ring-primary'
                )}
                onClick={() => setSelectedBlock(block)}
              >
                {block.name}
              </div>
            ))}
          </div>
          {selectedBlock ? (
            <div className="mt-4">
              <h2 className="font-semibold">Update block</h2>
              <UpdateBlockForm
                key={selectedBuilding._id + selectedBlock._id}
                block={selectedBlock}
                onDelete={() => setSelectedBlock(null)}
              />
            </div>
          ) : (
            <div className="mt-4">
              <h2 className="font-semibold">Add new block</h2>
              <CreateBlocksForm
                key={selectedBuilding._id}
                building={selectedBuilding}
              />
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
  );
};

export default Blocks;
