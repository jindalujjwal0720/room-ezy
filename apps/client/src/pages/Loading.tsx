/// <reference types="vite-plugin-svgr/client" />
import { cn } from '../lib/utils';
import HintBoxArrow from '../assets/hint-box-arrow.svg?react';
import Loading from '../components/Loading';

const ProfileHintBox = () => {
  return (
    <div className="relative">
      <HintBoxArrow className="absolute -top-full left-32 w-52" />
      <div className="bg-background p-2 rounded-md max-w-52 text-sm ring ring-muted shadow-md">
        Here you can see your allotment status and other details.
      </div>
    </div>
  );
};

const ThemeSwitchHintBox = () => {
  return (
    <div className="relative">
      <HintBoxArrow className="absolute -top-full left-32 w-52" />
      <div className="bg-background p-2 rounded-md max-w-52 text-sm ring ring-muted shadow-md">
        You can switch between light and dark themes using this button.
      </div>
    </div>
  );
};

const BuildingSelectHintBox = () => {
  return (
    <div className="relative">
      <HintBoxArrow className="absolute -top-[5rem] right-36 w-52 -scale-x-100" />
      <div className="bg-background p-2 rounded-md max-w-52 text-sm ring ring-muted shadow-md">
        Here you can select the building you want to view.
      </div>
    </div>
  );
};

const hints = [
  { key: 'profile', hintBox: ProfileHintBox },
  { key: 'theme', hintBox: ThemeSwitchHintBox },
  { key: 'building', hintBox: BuildingSelectHintBox },
];

const LoadingPage = () => {
  const hintIndex = Math.floor(Math.random() * hints.length);
  const hintKey = hints[hintIndex].key;
  const HintBox = hints[hintIndex].hintBox;

  return (
    <div className="h-dvh w-dvw overflow-hidden flex flex-col">
      <div className="sticky top-0 z-10 backdrop-blur-md bg-muted/10 border-b border-muted">
        <div className="flex items-center justify-between px-6 py-2">
          <div className="text-lg font-semibold text-primary flex gap-2 items-center">
            <img src="/logo.svg" alt="RoomEzy Logo" className="w-8 h-8" />
            RoomEzy
          </div>
          <div className="flex items-center justify-end gap-4">
            <div
              className={cn(
                'flex items-center justify-end gap-3 cursor-pointer py-1 px-2 rounded-md ring-2 ring-muted h-10 w-10 relative',
                hintKey === 'theme' ? 'ring-primary' : 'animate-pulse'
              )}
            >
              {hintKey === 'theme' && (
                <div className="absolute top-full m-8 w-max">
                  <HintBox />
                </div>
              )}
            </div>
            <div
              className={cn(
                'flex items-center justify-end gap-3 py-1 px-2 rounded-md ring-2 ring-muted relative',
                hintKey === 'profile' ? 'ring-primary' : 'animate-pulse'
              )}
            >
              <div className="bg-muted rounded-full h-8 w-8"></div>
              <div className="animate-pulse flex flex-col gap-2">
                <span className="animate-pulse bg-muted w-16 h-2 rounded-sm"></span>
                <span className="animate-pulse bg-muted w-8 h-2 rounded-sm"></span>
              </div>
              {hintKey === 'profile' && (
                <div className="absolute top-full m-10 w-max">
                  <HintBox />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <h2 className="font-semibold px-4 mt-4">Buildings</h2>
        <div className="flex flex-wrap gap-4 px-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`building-${index}`}
              className={cn(
                'text-sm w-32 h-10 px-4 py-2 ring-2 ring-muted rounded-md bg-muted relative',
                index === 1 && hintKey === 'building'
                  ? 'ring-primary'
                  : 'animate-pulse'
              )}
            >
              {index === 1 && hintKey === 'building' && (
                <div className="absolute top-full m-10 w-max">
                  <HintBox />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loading size="lg" />
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
