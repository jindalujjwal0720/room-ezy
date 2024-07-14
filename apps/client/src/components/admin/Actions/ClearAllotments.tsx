import { useState } from 'react';
import { useClearAllocationForBuildingMutation } from '../../../api/building';
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

interface ClearAllotmentsProps {
  building: Building;
}

const ClearAllotments = ({ building }: ClearAllotmentsProps) => {
  const [clearAllotments, { isLoading: clearAllotmentsLoading }] =
    useClearAllocationForBuildingMutation();
  const [openClearAlert, setOpenClearAlert] = useState(false);

  const handleClearAllotments = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    try {
      await clearAllotments({
        id: building?._id,
      }).unwrap();
      toast.success('Allotments cleared successfully');
      setOpenClearAlert(false);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <AlertDialog open={openClearAlert} onOpenChange={setOpenClearAlert}>
        <AlertDialogTrigger asChild>
          <Button
            className="w-full hover:bg-destructive text-destructive hover:text-destructive-foreground"
            size="sm"
            variant="outline"
            disabled={clearAllotmentsLoading}
          >
            Clear Allotments
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Allotments for Building</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to clear all the allotments for the building{' '}
            <strong>{building.name}</strong>?
            <div className="text-sm text-muted-foreground mt-2">
              This will:
              <ul className="list-disc pl-8">
                <li>Clear all the allotments for the building</li>
                <li>Unlock the allotments for the students</li>
              </ul>
            </div>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleClearAllotments}>
              Yes, clear
            </AlertDialogAction>
            <AlertDialogCancel>No, cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <p className="text-xs text-muted-foreground">
        <strong className="text-destructive">Irreversible Warning:</strong>{' '}
        Clear all the allotments for the students in this building.{' '}
      </p>
    </div>
  );
};

export default ClearAllotments;
