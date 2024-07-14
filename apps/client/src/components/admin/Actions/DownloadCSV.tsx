import { Button } from '../../ui/button';
import { toast } from 'sonner';

import { getErrorMessage } from '../../../utils/error';
import { downloadFileFromAPI } from '../../../utils/download';

interface Building {
  _id: string;
  name: string;
}

interface DownloadCSVProps {
  building: Building;
}

const DownloadCSV = ({ building }: DownloadCSVProps) => {
  const handleDownloadAllotmentCSV = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    try {
      // Download the CSV
      await downloadFileFromAPI(
        `${import.meta.env.VITE_API_URL}/v1/buildings/${
          building?._id
        }/allotment-csv`,
        `room-allotment-${building?.name.toLocaleLowerCase()}.csv`
      );
      toast.success('Download started in the background');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button size="sm" variant="outline" onClick={handleDownloadAllotmentCSV}>
        Download CSV
      </Button>
      <p className="text-xs text-muted-foreground">
        <strong className="text-amber-600">Computationally Expensive:</strong>{' '}
        Download the allotment details for all the students in this building
      </p>
    </div>
  );
};

export default DownloadCSV;
