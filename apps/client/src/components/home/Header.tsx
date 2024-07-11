import { Link, useLocation } from 'react-router-dom';
import {
  clearCredentials,
  selectIsAdmin,
  selectUser,
} from '../../store/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import ThemeToggle from '../ThemeToggle';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';
import { Button } from '../ui/button';
import { useLogoutMutation } from '../../api/auth';
import { toast } from 'sonner';
import { getErrorMessage } from '../../utils/error';
import { useGetWantedRoomsQuery } from '../../api/room';

interface Room {
  _id: string;
  index: number;
  name: string;
  wantedByCount: number;
  capacity: number;
  chance: number;
}

const getInitials = (name: string) => {
  const names = name.split(' ');
  return names.map((n) => n[0]).join('');
};

const Header = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.includes('/admin');
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);

  const { data: { rooms = [] } = {} } = useGetWantedRoomsQuery<{
    data: { rooms: Room[] };
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
    <header className="sticky top-0 z-10 backdrop-blur-md bg-muted/10 border-b border-muted">
      <div className="flex justify-between px-6 py-2">
        <div>
          <Link to="/" className="text-lg font-semibold text-primary">
            RoomEzy
          </Link>
        </div>
        <div className="flex items-center justify-end gap-4">
          {!isAdminRoute && isAdmin && (
            <Link
              to="/admin"
              className="text-sm text-muted-foreground hover:bg-muted p-2 rounded"
            >
              Admin Panel
            </Link>
          )}
          {isAdminRoute && (
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:bg-muted p-2 rounded"
            >
              Home
            </Link>
          )}
          <ThemeToggle />

          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex items-center justify-end gap-3 cursor-pointer">
                <div className="text-xs bg-primary text-white p-2 rounded-full">
                  {getInitials(user?.name || '')}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold">{user?.name}</span>
                  <span className="text-xs text-zink-500">
                    {user?.admissionNumber}
                  </span>
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="p-2">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold">Wanted Rooms</span>
                  {rooms.length > 0 ? (
                    rooms.map((room) => (
                      <div key={room._id} className="flex items-center gap-2">
                        <span className="text-sm text-primary">
                          {room.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {room.wantedByCount}/{room.capacity} ({room.chance}%
                          chance)
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No rooms wanted yet
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    Log out
                  </Button>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </header>
  );
};

export default Header;
