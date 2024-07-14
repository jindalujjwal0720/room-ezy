import { useGenerateProbableRoomsMutation } from '../../../api/building';
import { Button } from '../../ui/button';
import { toast } from 'sonner';
import { getErrorMessage } from '../../../utils/error';

interface Building {
  _id: string;
  name: string;
}

interface PredictAllocationProps {
  building: Building;
}

const PredictAllocation = ({ building }: PredictAllocationProps) => {
  const [predictAllocation, { isLoading: predictAllocationLoading }] =
    useGenerateProbableRoomsMutation();

  const handlePredictAllocation = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    try {
      const payload = await predictAllocation({
        id: building._id,
      }).unwrap();
      toast.success(payload.message);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={handlePredictAllocation}
        disabled={predictAllocationLoading}
      >
        Predict Allocation
      </Button>
      <p className="text-xs text-muted-foreground">
        Predict the room allocation for all the students in this building
      </p>
    </div>
  );
};

export default PredictAllocation;
