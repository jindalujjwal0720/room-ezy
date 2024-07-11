import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { useCreateBuildingMutation } from '../../../api/building';
import { toast } from 'sonner';
import { getErrorMessage } from '../../../utils/error';

const CreateBuildingForm = () => {
  const [createBuilding, { isLoading: createBuildingLoading }] =
    useCreateBuildingMutation();

  const handleAddBuilding = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const buildingName = formData.get('buildingName') as string;

    try {
      const payload = await createBuilding({ name: buildingName }).unwrap();
      toast.success(payload.message);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <form
      className="text-sm p-4 ring-1 ring-muted rounded-md mt-2"
      onSubmit={handleAddBuilding}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="buildingName">Building name</Label>
        <Input
          placeholder="Building name"
          name="buildingName"
          id="buildingName"
          type="text"
          required={true}
          defaultValue=""
        />
      </div>
      <Button className="mt-4" size="sm" disabled={createBuildingLoading}>
        Add building
      </Button>
    </form>
  );
};

export default CreateBuildingForm;
