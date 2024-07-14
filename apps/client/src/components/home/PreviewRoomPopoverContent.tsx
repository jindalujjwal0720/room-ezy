import {
  useGetAllotedRoomForUserQuery,
  useGetRoomByIdQuery,
  useGetWantedRoomsQuery,
  useUpdateRoomsWantedByUserMutation,
} from '../../api/room';
import { Button } from '../ui/button';
import { getErrorMessage } from '../../utils/error';
import { toast } from 'sonner';
import Loading from '../Loading';

interface User {
  _id: string;
  name: string;
  admissionNumber: string;
}

interface Room {
  _id: string;
  index: number;
  name: string;
  wantedByCount: number;
  capacity: number;
  allotedTo: User[];
}

interface RoomPopoverContentProps {
  roomId: string;
}

const PreviewRoomPopoverContent = ({ roomId }: RoomPopoverContentProps) => {
  const { data: { room } = {}, isFetching: isFetchingRoom } =
    useGetRoomByIdQuery<{
      data: { room: Room };
      isFetching: boolean;
    }>(roomId, { skip: !roomId });
  const [wantRoom, { isLoading: isWantingRoom }] =
    useUpdateRoomsWantedByUserMutation();

  const { data: { rooms: wantedRooms = [], maxWantsAllowed = 3 } = {} } =
    useGetWantedRoomsQuery<{
      data: { rooms: Room[]; maxWantsAllowed: number };
    }>({});
  const { data: { room: allocatedRoom } = {} } = useGetAllotedRoomForUserQuery<{
    data: { room: Room };
  }>({});

  const isRoomWanted = wantedRooms.some(({ _id }) => _id === room?._id);
  const isAnyRoomAllocated = !!allocatedRoom;
  const isThisRoomAllocated = allocatedRoom?._id === room?._id;

  const handleRoomWant = async () => {
    if (isWantingRoom) {
      return;
    }

    try {
      await wantRoom({
        roomId: room?._id,
      }).unwrap();
      toast.success('Room requested successfully.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="flex justify-between space-x-4">
      <Loading show={isFetchingRoom} />
      {!isFetchingRoom && (
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">Room {room?.name}</h4>
          {isThisRoomAllocated ? (
            <>
              <p className="text-sm">
                You have been allocated this room. Please contact the admin for
                further details.
              </p>
              <p className="text-sm text-muted-foreground">
                Alloted to: {room?.allotedTo.map(({ name }) => name).join(', ')}
              </p>
            </>
          ) : (
            <p className="text-sm">
              {isAnyRoomAllocated ? (
                <>
                  <p>Room allocations are already done.</p>
                  <p className="text-muted-foreground">
                    Alloted to:{' '}
                    {room?.allotedTo && room.allotedTo.length > 0
                      ? room.allotedTo.map(({ name }) => name).join(', ')
                      : 'No one'}
                  </p>
                </>
              ) : room?.wantedByCount && room?.wantedByCount > 0 ? (
                <>
                  <strong>{room?.wantedByCount}</strong> student(s) want this
                  room. Maximum capacity is {room?.capacity}.
                </>
              ) : (
                'No one wants this room yet. Be the first one to request.'
              )}
            </p>
          )}
          {!isAnyRoomAllocated && (
            <div className="flex pt-2">
              <Button
                size="sm"
                onClick={handleRoomWant}
                disabled={
                  isWantingRoom ||
                  wantedRooms.length >= maxWantsAllowed ||
                  isRoomWanted
                }
              >
                I want
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PreviewRoomPopoverContent;
