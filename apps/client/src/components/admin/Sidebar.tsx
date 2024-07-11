import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

const Sidebar = () => {
  const location = useLocation();
  const links = [
    {
      name: 'Dashboard',
      url: '/admin',
    },
    {
      name: 'Buildings',
      url: '/admin/buildings',
    },
    {
      name: 'Blocks',
      url: '/admin/blocks',
    },
    {
      name: 'Floors',
      url: '/admin/floors',
    },
  ];

  return (
    <div className="w-64">
      <div className="flex flex-col p-4 gap-2">
        {links.map((link, index) => (
          <Link
            to={link.url}
            key={index}
            className={cn(
              'text-sm px-4 py-2 rounded-md hover:bg-muted cursor-pointer',
              location.pathname === link.url && 'bg-muted'
            )}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
