import {
  useGetRoomsQuery,
  useGetWantedRoomsQuery,
  useUpdateRoomsWantedByUserMutation,
} from '../../api/room';
import { cn } from '../../lib/utils';

import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';
import { Button } from '../ui/button';
import { getErrorMessage } from '../../utils/error';
import { toast } from 'sonner';

interface Floor {
  _id: string;
  name: string;
  mapType: string;
  namingConvention: string;
  roomsCount: number;
  roomCapacity: number;
}

interface Room {
  _id: string;
  index: number;
  name: string;
  wantedByCount: number;
  capacity: number;
  chance: number;
}

interface FloorPreviewProps {
  floor: Floor | null;
  rooms?: Room[];
  className?: string;
}

interface RoomProps {
  room: Room;
}

const COLORS = [
  '#027F31dc',
  '#05953Cdc',
  '#0AAA46dc',
  '#0FBF52dc',
  '#16D25Ddc',
  '#18D11Bdc',
  '#59D01Bdc',
  '#9BCF1Ddc',
  '#CEC11Fdc',
  '#CC8322dc',
  '#CB4624dc',
  '#CA2640dc',
];

const getColorAccordingToPercentage = (percentage: number) => {
  let index = COLORS.length - Math.floor((percentage / 100) * COLORS.length);
  index = Math.max(0, Math.min(index, COLORS.length - 1));
  return COLORS[index];
};

const Room = ({ room }: RoomProps) => {
  const { data: { rooms: wantedRooms = [] } = {} } = useGetWantedRoomsQuery({});
  const [wantRoom, { isLoading: isWantingRoom }] =
    useUpdateRoomsWantedByUserMutation();

  const handleRoomWant = async () => {
    if (isWantingRoom) {
      return;
    }

    try {
      await wantRoom({
        roomId: room._id,
      }).unwrap();
      toast.success('Room requested successfully.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          style={{
            backgroundColor: getColorAccordingToPercentage(room.chance),
          }}
          className="size-10 bg-muted rounded-md flex items-center justify-center cursor-pointer hover:bg-muted-foreground hover:text-muted"
        >
          {room.index}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Room {room.name}</h4>
            <p className="text-sm">
              <strong>{room.wantedByCount || 'No'}</strong> student(s) want this
              room yet. Maximum capacity is {room.capacity}.
            </p>
            {wantedRooms.length > 0 ? (
              <div className="pt-2 text-xs text-muted-foreground">
                You have already requested a room. Please wait for the admin to
                approve.
              </div>
            ) : (
              <>
                <div className="pt-2 text-xs text-muted-foreground">
                  You have <strong>{room.chance}%</strong> chance of getting
                  this room if you want it.
                </div>
                <div className="flex pt-2">
                  <Button
                    size="sm"
                    onClick={handleRoomWant}
                    disabled={isWantingRoom}
                  >
                    I want
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const LinearFloorPreview = ({ rooms = [] }: FloorPreviewProps) => {
  return (
    <div className="flex gap-4 min-h-40 w-full items-center justify-center">
      {rooms.map((room) => (
        <Room key={room._id} room={room} />
      ))}
    </div>
  );
};

const OppositeFloorPreview = ({ rooms = [] }: FloorPreviewProps) => {
  const firstHalfRooms = rooms.slice(0, rooms.length / 2);
  const secondHalfRooms = rooms.slice(rooms.length / 2).reverse();

  return (
    <div className="flex flex-col gap-4 min-h-40 w-full items-center justify-center">
      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          {firstHalfRooms.map((room) => (
            <Room key={room._id} room={room} />
          ))}
        </div>
        <div className="w-full h-8 bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-xs uppercase tracking-widest">
            Walkway
          </span>
        </div>
        <div className="flex gap-4">
          {secondHalfRooms.map((room) => (
            <Room key={room._id} room={room} />
          ))}
        </div>
      </div>
    </div>
  );
};

const AlternateFloorPreview = ({ rooms = [] }: FloorPreviewProps) => {
  const firstHalfRooms = rooms.filter(({ index }) => index % 2 === 1);
  const secondHalfRooms = rooms.filter(({ index }) => index % 2 === 0);

  return (
    <div className="flex flex-col gap-4 min-h-40 w-full items-center justify-center">
      <div className="flex flex-col gap-2">
        <div className="flex gap-14">
          {firstHalfRooms.map((room) => (
            <Room key={room._id} room={room} />
          ))}
        </div>
        <div className="w-full h-8 bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-xs uppercase tracking-widest">
            Walkway
          </span>
        </div>
        <div className="flex gap-14 ml-12">
          {secondHalfRooms.map((room) => (
            <Room key={room._id} room={room} />
          ))}
        </div>
      </div>
    </div>
  );
};

const RectangleFloorPreview = ({ rooms = [] }: FloorPreviewProps) => {
  const topRooms = rooms.slice(0, rooms.length / 4);
  const rightRooms = rooms.slice(rooms.length / 4, (rooms.length / 4) * 2);
  const bottomRooms = rooms
    .slice((rooms.length / 4) * 2, (rooms.length / 4) * 3)
    .reverse();
  const leftRooms = rooms.slice((rooms.length / 4) * 3).reverse();

  return (
    <div className="flex flex-col gap-4 min-h-40 w-full items-center justify-center">
      <div className="flex gap-4 px-14">
        <div className="flex gap-4">
          {topRooms.map((room) => (
            <Room key={room._id} room={room} />
          ))}
        </div>
      </div>
      <div className="flex gap-4 justify-between w-full">
        <div className="flex flex-col gap-4">
          {leftRooms.map((room) => (
            <Room key={room._id} room={room} />
          ))}
        </div>
        <div className="flex-1 bg-muted flex items-center justify-center rounded-md p-6">
          <div className="flex-1 h-full rounded-sm flex items-center justify-center text-muted-foreground text-xs uppercase tracking-widest bg-background">
            Walkway
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {rightRooms.map((room) => (
            <Room key={room._id} room={room} />
          ))}
        </div>
      </div>
      <div className="flex gap-4 px-14">
        <div className="flex gap-4">
          {bottomRooms.map((room) => (
            <Room key={room._id} room={room} />
          ))}
        </div>
      </div>
    </div>
  );
};

const OppositeRectangleFloorPreview = ({ rooms = [] }: FloorPreviewProps) => {
  const topRooms = rooms.slice(0, rooms.length / 4);
  const topUpperRooms = topRooms.filter(({ index }) => index % 2 === 1);
  const topLowerRooms = topRooms.filter(({ index }) => index % 2 === 0);
  const rightRooms = rooms.slice(rooms.length / 4, (rooms.length / 4) * 2);
  const rightUpperRooms = rightRooms.filter(({ index }) => index % 2 === 1);
  const rightLowerRooms = rightRooms.filter(({ index }) => index % 2 === 0);
  const bottomRooms = rooms
    .slice((rooms.length / 4) * 2, (rooms.length / 4) * 3)
    .reverse();
  const bottomUpperRooms = bottomRooms.filter(({ index }) => index % 2 === 0);
  const bottomLowerRooms = bottomRooms.filter(({ index }) => index % 2 === 1);
  const leftRooms = rooms.slice((rooms.length / 4) * 3).reverse();
  const leftUpperRooms = leftRooms.filter(({ index }) => index % 2 === 0);
  const leftLowerRooms = leftRooms.filter(({ index }) => index % 2 === 1);

  const dummyWidth = Math.round(
    Math.max(topRooms.length, bottomRooms.length) * 28
  );
  const dummyHeight = Math.round(
    Math.max(leftRooms.length, rightRooms.length) * 20
  );

  return (
    <div className="flex flex-col gap-4 min-h-40 w-full items-center justify-center">
      <div className="flex flex-col gap-2 w-full">
        <div className="flex gap-4 justify-center">
          {topUpperRooms.map((room) => (
            <Room key={room._id} room={room} />
          ))}
        </div>
        <div className="w-full px-12">
          <div className="w-full h-6 bg-muted"></div>
        </div>
        <div className="flex gap-4 justify-center">
          {topLowerRooms.map((room) => (
            <Room key={room._id} room={room} />
          ))}
        </div>
      </div>
      <div className="flex gap-4 justify-between w-full">
        <div className="flex gap-2">
          <div className="flex flex-col gap-4 justify-center">
            {leftUpperRooms.map((room) => (
              <Room key={room._id} room={room} />
            ))}
          </div>
          <div className="h-full w-6 bg-muted flex items-center justify-center relative">
            <div className="absolute h-16 -top-16 w-6 bg-muted" />
            <div className="absolute h-16 -bottom-16 w-6 bg-muted" />
          </div>
          <div className="flex flex-col gap-4 justify-center">
            {leftLowerRooms.map((room) => (
              <Room key={room._id} room={room} />
            ))}
          </div>
        </div>
        <div style={{ width: dummyWidth, height: dummyHeight }}></div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-4 justify-center">
            {rightUpperRooms.map((room) => (
              <Room key={room._id} room={room} />
            ))}
          </div>
          <div className="h-full w-6 bg-muted flex items-center justify-center relative">
            <div className="absolute h-16 -top-16 w-6 bg-muted" />
            <div className="absolute h-16 -bottom-16 w-6 bg-muted" />
          </div>
          <div className="flex flex-col gap-4 justify-center">
            {rightLowerRooms.map((room) => (
              <Room key={room._id} room={room} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex gap-4 justify-center">
          {bottomUpperRooms.map((room) => (
            <Room key={room._id} room={room} />
          ))}
        </div>
        <div className="w-full px-12">
          <div className="w-full h-6 bg-muted"></div>
        </div>
        <div className="flex gap-4 justify-center">
          {bottomLowerRooms.map((room) => (
            <Room key={room._id} room={room} />
          ))}
        </div>
      </div>
    </div>
  );
};

const componentsMap: {
  [key: string]: React.ComponentType<FloorPreviewProps>;
} = {
  linear: LinearFloorPreview,
  opposite: OppositeFloorPreview,
  alternate: AlternateFloorPreview,
  rectangle: RectangleFloorPreview,
  'opposite-rectangle': OppositeRectangleFloorPreview,
};

const FloorPreview = ({ floor, className }: FloorPreviewProps) => {
  const { data: { rooms = [] } = {} } = useGetRoomsQuery(floor?._id || '', {
    skip: !floor || !floor._id,
  });
  const PreviewComponent = componentsMap[floor?.mapType || 'linear'];

  if (!floor) {
    return null;
  }

  if (!PreviewComponent) {
    return (
      <div className="mt-4 w-full rounded-md bg-red-50 text-xs text-red-600 dark:bg-red-800 dark:text-red-200 p-4">
        There is some issue with the floor preview. Please contact the admin.
      </div>
    );
  }

  return (
    <ScrollArea className={cn('w-full', className)}>
      <div className="w-max p-4">
        <PreviewComponent floor={floor} rooms={rooms} />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default FloorPreview;
