import { Input } from '../../ui/input';
import { Button, buttonVariants } from '../../ui/button';
import { Label } from '../../ui/label';
import {
  useDeleteBuildingMutation,
  useUpdateBuildingMutation,
} from '../../../api/building';
import { toast } from 'sonner';
import { getErrorMessage } from '../../../utils/error';

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

interface Building {
  _id: string;
  name: string;
}

type UpdateBuildingProps = {
  building: Building | null;
  onDelete?: () => void;
};

const UpdateBuildingForm = ({ building, onDelete }: UpdateBuildingProps) => {
  const [updateBuilding, { isLoading: updateBuildingLoading }] =
    useUpdateBuildingMutation();
  const [deleteBuilding, { isLoading: deleteBuildingLoading }] =
    useDeleteBuildingMutation();

  const handleUpdateBuilding = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const buildingName = formData.get('buildingName') as string;

    try {
      const payload = await updateBuilding({
        id: building?._id,
        building: { name: buildingName },
      }).unwrap();
      toast.success(payload.message);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  const handleDeleteBuilding = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    try {
      const payload = await deleteBuilding({ id: building?._id }).unwrap();
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
      onSubmit={handleUpdateBuilding}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="buildingName">Building name</Label>
        <Input
          placeholder="Building name"
          name="buildingName"
          id="buildingName"
          type="text"
          required={true}
          defaultValue={building ? building.name : ''}
        />
      </div>
      <div className="flex gap-2 mt-4">
        <Button type="submit" size="sm" disabled={updateBuildingLoading}>
          Update building
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              disabled={deleteBuildingLoading}
              variant="destructive"
            >
              Delete building
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Building</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Are you sure you want to delete the building{' '}
              <strong>{building?.name}</strong>?
              <div className="text-sm text-muted-foreground mt-2">
                This will:
                <ul className="list-disc pl-8">
                  <li>Delete all the blocks in the building</li>
                  <li>Delete all the floors in the building</li>
                  <li>Delete all the rooms in the building</li>
                  <li>
                    <span className="text-red-500">Unallocate</span> all the
                    students in the building
                  </li>
                </ul>
              </div>
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={handleDeleteBuilding}
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

export default UpdateBuildingForm;
