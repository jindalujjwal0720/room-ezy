import { useGetBlocksQuery } from '../../api/block';

import UpdateBlockForm from '../admin/forms/UpdateBlock';
import CreateBlocksForm from '../admin/forms/CreateBlocks';
import Loading from '../Loading';
import WrapList, { WrapListItem } from '../custom/WrapList';

interface Building {
  _id: string;
  name: string;
}

interface BuildingBlock {
  _id: string;
  name: string;
}

interface BlocksProps {
  selectedBuilding: Building;
  selectedBlock: BuildingBlock | null;
  onSelect: (block: BuildingBlock | null) => void;
  showForms?: boolean;
}

const Blocks = ({
  selectedBuilding,
  selectedBlock,
  onSelect,
  showForms = true,
}: BlocksProps) => {
  const { data: { blocks = [] } = {}, isFetching: isFetchingBlocks } =
    useGetBlocksQuery<{
      data: { blocks: BuildingBlock[] };
      isFetching: boolean;
    }>(selectedBuilding?._id, {
      skip: !selectedBuilding,
    });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold">Blocks</h2>
      <Loading show={isFetchingBlocks} />
      {!isFetchingBlocks && (
        <>
          <div className="flex flex-wrap gap-4">
            {showForms && (
              <WrapListItem
                item={{ _id: '', name: 'Add new blocks' }}
                selected={selectedBlock?._id ?? ''}
                onSelect={() => onSelect(null)}
                keyField="_id"
                valueField="name"
              />
            )}
            <WrapList
              items={blocks}
              keyField="_id"
              valueField="name"
              selected={selectedBlock?._id ?? ''}
              onSelect={onSelect}
            />
          </div>

          {showForms && (
            <div className="flex flex-col gap-2">
              {selectedBlock ? (
                <>
                  <h2 className="font-semibold">Update block</h2>
                  <UpdateBlockForm
                    key={selectedBuilding._id + selectedBlock._id}
                    block={selectedBlock}
                    onDelete={() => {
                      onSelect(null);
                    }}
                  />
                </>
              ) : (
                <>
                  <h2 className="font-semibold">Add new block</h2>
                  <CreateBlocksForm
                    key={selectedBuilding._id}
                    building={selectedBuilding}
                  />
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Blocks;
