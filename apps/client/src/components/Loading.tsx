import { cn } from '../lib/utils';

interface LoadingProps {
  show?: boolean;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  text?: boolean;
  full?: boolean;
}

const Loading = ({
  show = true,
  fullScreen = false,
  size = 'md',
  text = true,
  full = false,
}: LoadingProps) => {
  if (!show) return null;

  return (
    <div
      className={cn(
        'flex-1 flex flex-col items-center justify-center mt-4',
        fullScreen &&
          'h-dvh w-dvw fixed top-0 left-0 backdrop-blur-sm z-10 pointer-events-none',
        full && 'h-full w-full flex-1 z-10 pointer-events-none'
      )}
    >
      <img
        src="/logo.svg"
        alt="RoomEzy Logo"
        className={cn(
          'animate-bounce',
          size === 'sm' && 'w-8 h-8',
          size === 'md' && 'w-10 h-10',
          size === 'lg' && 'w-12 h-12'
        )}
      />
      <div
        className={cn(
          'font-semibold text-muted-foreground mt-4 hidden',
          size === 'sm' && 'text-sm mt-2',
          size === 'lg' && 'text-lg',
          text && 'block'
        )}
      >
        Loading...
      </div>
    </div>
  );
};

export default Loading;
