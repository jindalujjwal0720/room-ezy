import { Input } from '../../ui/input';
import { Button, buttonVariants } from '../../ui/button';
import { Label } from '../../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import {
  useDeleteFloorMutation,
  useUpdateFloorMutation,
} from '../../../api/floor';
import { getErrorMessage } from '../../../utils/error';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../ui/alert-dialog';

interface Floor {
  _id: string;
  name: string;
  mapType: string;
  namingConvention: string;
  roomsCount: number;
  roomCapacity: number;
}

type UpdateFloorProps = {
  floor: Floor | null;
  onDelete?: () => void;
};

const mapTypes = [
  { value: 'linear', label: 'Linear' },
  { value: 'alternate', label: 'Alternate' },
  { value: 'opposite', label: 'Opposite' },
  { value: 'rectangle', label: 'Rectangle' },
  { value: 'opposite-rectangle', label: 'Opposite Rectangle' },
];

const UpdateFloorForm = ({ floor, onDelete }: UpdateFloorProps) => {
  const [updateFloor, { isLoading: updateFloorLoading }] =
    useUpdateFloorMutation();
  const [deleteFloor, { isLoading: deleteFloorLoading }] =
    useDeleteFloorMutation();

  const handleUpdateFloor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get('floorName') as string;
    const roomsCount = Number(formData.get('roomsCount'));
    const roomCapacity = Number(formData.get('roomCapacity'));
    const mapType = formData.get('mapType') as string;
    const namingConvention = formData.get('namingConvention') as string;

    try {
      const payload = await updateFloor({
        id: floor?._id,
        floor: {
          name,
          mapType,
          namingConvention,
          roomsCount,
          roomCapacity,
        },
      }).unwrap();
      toast.success(payload.message);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  const handleDeleteFloor = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const payload = await deleteFloor({ id: floor?._id }).unwrap();
      toast.success(payload.message);
      onDelete instanceof Function && onDelete();
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <form
      className="text-sm p-4 ring-1 ring-muted rounded-md"
      onSubmit={handleUpdateFloor}
    >
      <div className="flex flex-col gap-4">
        <div className="grid gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="mapType">Floor Name</Label>
            <Input
              placeholder="Floor Name"
              name="floorName"
              id="floorName"
              type="text"
              required={true}
              defaultValue={floor?.name || ''}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="mapType">Map type</Label>
            <Select name="mapType" defaultValue={floor?.mapType || 'linear'}>
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
              defaultValue={floor?.roomCapacity || 1}
              min={1}
              step={1}
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
              defaultValue={floor?.roomsCount || 0}
              min={1}
              step={1}
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
              defaultValue={floor?.namingConvention || '{block}-{floor}-{room}'}
            />
            <p className="text-xs text-muted-foreground">
              Note: This will update all the rooms naming convention. Available
              placeholders: {`{building}`}, {`{block}`}, {`{floor}`}, {`{room}`}
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button disabled={updateFloorLoading} size="sm">
          Update Floor
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              disabled={deleteFloorLoading}
              variant="destructive"
            >
              Delete Floor
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Floor</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Are you sure you want to delete the floor{' '}
              <strong>{floor?.name}</strong>?
              <div className="text-sm text-muted-foreground mt-2">
                This will:
                <ul className="list-disc pl-8">
                  <li>Delete all the rooms in the floor</li>
                  <li>
                    <span className="text-red-500">Unallocate</span> all the
                    students in the block
                  </li>
                </ul>
              </div>
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={handleDeleteFloor}
                className={buttonVariants({
                  variant: 'destructive',
                  size: 'sm',
                })}
              >
                Delete
              </AlertDialogAction>
              <AlertDialogCancel
                className={buttonVariants({ variant: 'secondary', size: 'sm' })}
              >
                Cancel
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </form>
  );
};

export default UpdateFloorForm;
