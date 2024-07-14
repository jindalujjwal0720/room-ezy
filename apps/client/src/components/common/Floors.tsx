import { useGetFloorsQuery } from '../../api/floor';
import UpdateFloorForm from '../admin/forms/UpdateFloor';
import CreateFloorsForm from '../admin/forms/CreateFloors';
import Loading from '../Loading';
import WrapList, { WrapListItem } from '../custom/WrapList';

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

interface FloorsProps {
  selectedBlock: BuildingBlock;
  selectedFloor: Floor | null;
  onSelect: (floor: Floor | null) => void;
  showForms?: boolean;
}

const Floors = ({
  selectedBlock,
  selectedFloor,
  onSelect,
  showForms = true,
}: FloorsProps) => {
  const { data: { floors = [] } = {}, isFetching: isFetchingFloors } =
    useGetFloorsQuery<{
      data: { floors: Floor[] };
      isFetching: boolean;
    }>(selectedBlock?._id, {
      skip: !selectedBlock,
    });

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold">Floors</h2>
      <Loading show={isFetchingFloors} />
      {!isFetchingFloors && (
        <>
          <div className="flex flex-wrap gap-4">
            {showForms && (
              <WrapListItem
                item={{ _id: '', name: 'Add new floors' }}
                selected={selectedFloor?._id ?? ''}
                onSelect={() => onSelect(null)}
                keyField="_id"
                valueField="name"
              />
            )}
            <WrapList
              items={floors}
              keyField="_id"
              valueField="name"
              selected={selectedFloor?._id ?? ''}
              onSelect={onSelect}
            />
          </div>

          {showForms && (
            <div className="flex flex-col gap-2">
              {selectedFloor ? (
                <>
                  <h2 className="font-semibold">Update floor</h2>
                  <UpdateFloorForm
                    key={selectedFloor._id}
                    floor={selectedFloor}
                    onDelete={() => onSelect(null)}
                  />
                </>
              ) : (
                <>
                  <h2 className="font-semibold">Add new floor</h2>
                  <CreateFloorsForm
                    key={selectedBlock._id}
                    block={selectedBlock}
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

export default Floors;
