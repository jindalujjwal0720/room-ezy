import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { useCreateMultipleFloorsMutation } from '../../../api/floor';
import { getErrorMessage } from '../../../utils/error';
import { toast } from 'sonner';

interface Block {
  _id: string;
  name: string;
}

type CreateFloorsProps = {
  block: Block | null;
};

const mapTypes = [
  { value: 'linear', label: 'Linear' },
  { value: 'alternate', label: 'Alternate' },
  { value: 'opposite', label: 'Opposite' },
  { value: 'rectangle', label: 'Rectangle' },
  { value: 'opposite-rectangle', label: 'Opposite Rectangle' },
];

const CreateFloorsForm = ({ block }: CreateFloorsProps) => {
  const [createFloors, { isLoading: createFloorsLoading }] =
    useCreateMultipleFloorsMutation();

  const handleAddFloors = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const roomsCount = Number(formData.get('roomsCount'));
    const roomCapacity = Number(formData.get('roomCapacity'));
    const floorsCount = Number(formData.get('floorsCount'));
    const mapType = formData.get('mapType') as string;
    const namingConvention = formData.get('namingConvention') as string;

    try {
      const payload = await createFloors({
        blockId: block?._id,
        count: floorsCount,
        roomsCount,
        roomCapacity,
        mapType,
        namingConvention,
      }).unwrap();
      toast.success(payload.message);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <form
      className="text-sm p-4 ring-1 ring-muted rounded-md mt-2"
      onSubmit={handleAddFloors}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="mapType">Map type</Label>
            <Select name="mapType" defaultValue="linear">
              <SelectTrigger>
                <SelectValue placeholder="Map Type" />
              </SelectTrigger>
              <SelectContent>
                {mapTypes.map((mapType) => (
                  <SelectItem key={mapType.value} value={mapType.value}>
                    {mapType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="roomCapacity">Room capacity</Label>
            <Input
              placeholder="Room capacity"
              name="roomCapacity"
              id="roomCapacity"
              type="number"
              required={true}
              min={1}
              step={1}
              defaultValue={1}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="roomsCount">Rooms count</Label>
            <Input
              placeholder="Rooms count"
              name="roomsCount"
              id="roomsCount"
              type="number"
              required={true}
              min={1}
              step={1}
              defaultValue={1}
            />
            <p className="text-xs text-muted-foreground">
              Note: This will <strong>delete</strong> all the rooms and create
              new rooms based on the new count.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="namingConvention">Naming convention</Label>
            <Input
              placeholder="Naming convention"
              name="namingConvention"
              id="namingConvention"
              type="text"
              required={true}
              defaultValue={
                block
                  ? block.name + '-{floor}-{room}'
                  : '{block}-{floor}-{room}'
              }
            />
            <p className="text-xs text-muted-foreground">
              Note: This will update all the rooms naming convention. Available
              placeholders: {`{building}`}, {`{block}`}, {`{floor}`}, {`{room}`}
            </p>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="floorsCount">Floors count</Label>
          <Input
            placeholder="Floors count"
            name="floorsCount"
            id="floorsCount"
            type="number"
            min={1}
            step={1}
            required={true}
            defaultValue={1}
          />
        </div>
      </div>
      <Button className="mt-4" size="sm" disabled={createFloorsLoading}>
        Add floor(s)
      </Button>
    </form>
  );
};

export default CreateFloorsForm;
