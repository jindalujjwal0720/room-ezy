import { useState } from 'react';
import { useResetBuildingMutation } from '../../../api/building';
import { Button } from '../../ui/button';
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

interface ResetBuildingProps {
  building: Building;
}

const ResetBuilding = ({ building }: ResetBuildingProps) => {
  const [resetBuilding, { isLoading: resetBuildingLoading }] =
    useResetBuildingMutation();

  const [openResetAlert, setOpenResetAlert] = useState(false);

  const handleResetBuilding = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    try {
      await resetBuilding({
        id: building._id,
      }).unwrap();
      toast.success('Building data reset successfully');
      setOpenResetAlert(false);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <AlertDialog open={openResetAlert} onOpenChange={setOpenResetAlert}>
        <AlertDialogTrigger asChild>
          <Button
            className="w-full hover:bg-destructive text-destructive hover:text-destructive-foreground"
            size="sm"
            variant="outline"
            disabled={resetBuildingLoading}
          >
            Reset Building
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Building Data</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to reset the data for the building{' '}
            <strong>{building.name}</strong>?
            <div className="text-sm text-muted-foreground mt-2">
              This will:
              <ul className="list-disc pl-8">
                <li>Reset all the data for the building</li>
                <li>Remove all the student wants</li>
                <li>Remove all the predicted allotments</li>
                <li>
                  <span className="text-red-500">Not remove</span> the
                  allotments for the students in this building
                </li>
              </ul>
            </div>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleResetBuilding}>
              Yes, reset
            </AlertDialogAction>
            <AlertDialogCancel>No, cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <p className="text-xs text-muted-foreground">
        <strong className="text-destructive">Irreversible Warning:</strong>{' '}
        Reset all the students data for the building.
      </p>
    </div>
  );
};

export default ResetBuilding;
