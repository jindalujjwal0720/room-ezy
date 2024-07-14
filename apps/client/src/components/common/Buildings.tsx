import { useGetBuildingsQuery } from '../../api/building';

import UpdateBuildingForm from '../admin/forms/UpdateBuilding';
import CreateBuildingForm from '../admin/forms/CreateBuilding';
import Loading from '../Loading';
import WrapList, { WrapListItem } from '../custom/WrapList';

interface Building {
  _id: string;
  name: string;
}

interface BuildingsProps {
  heading?: boolean;
  selectedBuilding: Building | null;
  onSelect: (building: Building | null) => void;
  showForms?: boolean;
}

const Buildings = ({
  heading = true,
  selectedBuilding,
  onSelect,
  showForms = true,
}: BuildingsProps) => {
  const { data: { buildings = [] } = {}, isFetching: isFetchingBuildings } =
    useGetBuildingsQuery<{
      data: { buildings: Building[] };
      isFetching: boolean;
    }>({});

  return (
    <div className="flex flex-col gap-4">
      {heading && <h1 className="font-semibold">Buildings</h1>}
      <Loading show={isFetchingBuildings} />
      {!isFetchingBuildings && (
        <>
          <div className="flex flex-wrap gap-4">
            {showForms && (
              <WrapListItem
                item={{ _id: '', name: 'Add new building' }}
                selected={selectedBuilding?._id ?? ''}
                onSelect={() => onSelect(null)}
                keyField="_id"
                valueField="name"
              />
            )}
            <WrapList
              items={buildings}
              keyField="_id"
              valueField="name"
              selected={selectedBuilding?._id ?? ''}
              onSelect={onSelect}
            />
          </div>

          {showForms && (
            <div className="flex flex-col gap-2">
              {selectedBuilding ? (
                <>
                  <h2 className="font-semibold">Update building</h2>
                  <UpdateBuildingForm
                    key={selectedBuilding._id}
                    building={selectedBuilding}
                    onDelete={() => onSelect(null)}
                  />
                </>
              ) : (
                <>
                  <h2 className="font-semibold">Add new building</h2>
                  <CreateBuildingForm />
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Buildings;
