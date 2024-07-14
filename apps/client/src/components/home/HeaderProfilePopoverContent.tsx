import { clearCredentials } from '../../store/slices/auth';
import { useDispatch } from 'react-redux';
import { Button } from '../ui/button';
import { useLogoutMutation } from '../../api/auth';
import { toast } from 'sonner';
import { getErrorMessage } from '../../utils/error';
import {
  useGetAllotedRoomForUserQuery,
  useGetProbableRoomsForUserQuery,
  useGetWantedRoomsQuery,
} from '../../api/room';
import { Label } from '../ui/label';
import Loading from '../Loading';

interface Room {
  _id: string;
  index: number;
  name: string;
  wantedByCount: number;
  capacity: number;
  chance: number;
}

const HeaderProfilePopoverContent = () => {
  const {
    data: { rooms: wantedRooms = [], maxWantsAllowed = 3 } = {},
    isFetching: isFetchingWantedRooms,
  } = useGetWantedRoomsQuery<{
    data: { rooms: Room[]; maxWantsAllowed: number };
    isFetching: boolean;
  }>({});

  const {
    data: { rooms: probableAllocatedRooms = [] } = {},
    isFetching: isFetchingPredictions,
  } = useGetProbableRoomsForUserQuery<{
    data: { rooms: Room[] };
    isFetching: boolean;
  }>({});

  const {
    data: { room: allocatedRoom } = {},
    isFetching: isFetchingAllotments,
  } = useGetAllotedRoomForUserQuery<{
    data: { room: Room };
    isFetching: boolean;
  }>({});

  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      dispatch(clearCredentials());
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Loading
        show={
          isFetchingWantedRooms || isFetchingPredictions || isFetchingAllotments
        }
        text={false}
      />
      {!isFetchingWantedRooms &&
        !isFetchingPredictions &&
        !isFetchingAllotments && (
          <>
            <div className="flex justify-between">
              <Label>Alloted Room</Label>
              {allocatedRoom ? (
                <span className="text-sm text-primary">
                  {allocatedRoom.name}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  No room alloted yet
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <Label>Wants Left</Label>
              <span className="text-xs text-muted-foreground">
                {maxWantsAllowed - wantedRooms.length}/{maxWantsAllowed} (
                {wantedRooms.length} used)
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Wanted Rooms</Label>
              {wantedRooms.length > 0 ? (
                wantedRooms.map((room) => (
                  <span className="text-sm text-muted-foreground">
                    {room.name}
                    {' - '}
                    {room.wantedByCount}/{room.capacity} ({room.chance}% chance)
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">
                  No rooms wanted yet
                </span>
              )}
            </div>
            <div className="flex justify-between">
              <Label>Predicted Room</Label>
              {probableAllocatedRooms.length > 0 ? (
                probableAllocatedRooms.map((room) => (
                  <span className="text-sm text-muted-foreground">
                    {room.name}
                  </span>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">
                  No predictions yet
                </span>
              )}
            </div>
          </>
        )}
      <div className="flex flex-col gap-2">
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </div>
  );
};

export default HeaderProfilePopoverContent;
