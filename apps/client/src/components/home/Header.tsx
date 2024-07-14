import { Link, useLocation } from 'react-router-dom';
import { selectIsAdmin } from '../../store/slices/auth';
import { useSelector } from 'react-redux';
import ThemeToggle from '../ThemeToggle';
import { useMeQuery } from '../../api/auth';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import HeaderProfilePopoverContent from './HeaderProfilePopoverContent';

interface User {
  _id: string;
  name: string;
  admissionNumber: string;
}

const getInitials = (name: string) => {
  const names = name.split(' ');
  return names.map((n) => n[0]).join('');
};

const Header = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.includes('/admin');
  const isAdmin = useSelector(selectIsAdmin);
  const { data: { user } = {} } = useMeQuery<{
    data: { user: User };
  }>({});

  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-muted/10 border-b border-muted">
      <div className="flex items-center justify-between px-6 py-2">
        <div>
          <Link
            to="/"
            className="text-lg font-semibold text-primary flex gap-2 items-center"
          >
            <img src="/logo.svg" alt="RoomEzy Logo" className="w-8 h-8" />
            RoomEzy
          </Link>
        </div>
        <div className="flex items-center justify-end gap-4">
          {!isAdminRoute && isAdmin && (
            <Link
              to="/admin"
              className="text-sm text-muted-foreground hover:bg-muted p-2 rounded hidden md:block"
            >
              Admin Panel
            </Link>
          )}
          {isAdminRoute && isAdmin && (
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:bg-muted p-2 rounded hidden md:block"
            >
              Home
            </Link>
          )}
          <ThemeToggle />
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center justify-end gap-3 cursor-pointer py-1 px-2 hover:bg-muted rounded-md">
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
            </PopoverTrigger>
            <PopoverContent className="p-3 m-2">
              <HeaderProfilePopoverContent />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default Header;
