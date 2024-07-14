const LoadingHeader = () => {
  return (
    <div className="sticky top-0 z-10 backdrop-blur-md bg-muted/10 border-b border-muted">
      <div className="flex items-center justify-between px-6 py-2">
        <div className="text-lg font-semibold text-primary flex gap-2 items-center">
          <img src="/logo.svg" alt="RoomEzy Logo" className="w-8 h-8" />
          RoomEzy
        </div>
        <div className="flex items-center justify-end gap-4">
          <div className="flex items-center justify-end gap-3 cursor-pointer py-1 px-2 rounded-md ring-2 ring-muted h-10 w-10 relative"></div>
          <div className="flex items-center justify-end gap-3 py-1 px-2 rounded-md ring-2 ring-muted relative">
            <div className="bg-muted rounded-full h-8 w-8"></div>
            <div className="animate-pulse flex flex-col gap-2">
              <span className="animate-pulse bg-muted w-16 h-2 rounded-sm"></span>
              <span className="animate-pulse bg-muted w-8 h-2 rounded-sm"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingHeader;
