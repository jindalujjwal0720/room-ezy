import { useState } from 'react';
import { useAllocateRoomsToStudentsMutation } from '../../../api/building';
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

interface AllocateRoomProps {
  building: Building;
}

const AllocateRooms = ({ building }: AllocateRoomProps) => {
  const [allocateRooms, { isLoading: allocateRoomsLoading }] =
    useAllocateRoomsToStudentsMutation();
  const [openAllocateAlert, setOpenAllocateAlert] = useState(false);

  const handleAllocateRooms = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    try {
      await allocateRooms({
        id: building?._id,
      }).unwrap();
      toast.success('Rooms allocated successfully');
      setOpenAllocateAlert(false);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <AlertDialog open={openAllocateAlert} onOpenChange={setOpenAllocateAlert}>
        <AlertDialogTrigger asChild>
          <Button
            className="w-full hover:bg-primary hover:text-primary-foreground"
            size="sm"
            variant="outline"
            disabled={allocateRoomsLoading}
          >
            Allocate Rooms
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Allocate Rooms</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to allocate rooms to all the students in the
            building <strong>{building.name}</strong>?
            <div className="text-sm text-muted-foreground mt-2">
              This will:
              <ul className="list-disc pl-8">
                <li>Allocate rooms to all the students</li>
                <li>
                  <span className="text-red-500">Overwrite</span> any existing
                  allotments
                </li>
                <li>Lock the allotments for the students in this building</li>
              </ul>
            </div>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={handleAllocateRooms}
              disabled={allocateRoomsLoading}
            >
              Yes, allocate
            </AlertDialogAction>
            <AlertDialogCancel>No, cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <p className="text-xs text-muted-foreground">
        <strong className="text-destructive">Irreversible Warning:</strong>{' '}
        Allocate rooms to all the students in this building.{' '}
        <strong> This will overwrite any existing allotments.</strong>
      </p>
    </div>
  );
};

export default AllocateRooms;
