import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { useCreateMultipleBlocksMutation } from '../../../api/block';
import { getErrorMessage } from '../../../utils/error';
import { toast } from 'sonner';

interface Building {
  _id: string;
}

type UpdateBlockProps = {
  building: Building | null;
};

const CreateBlocksForm = ({ building }: UpdateBlockProps) => {
  const [createBlocks, { isLoading: createBlocksLoading }] =
    useCreateMultipleBlocksMutation();

  const handleAddBlocks = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const blocksCount = Number(formData.get('blocksCount'));

    try {
      const payload = await createBlocks({
        buildingId: building?._id,
        count: blocksCount,
      }).unwrap();
      toast.success(payload.message);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <form
      className="text-sm p-4 ring-1 ring-muted rounded-md"
      onSubmit={handleAddBlocks}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="blocksCount">Blocks count</Label>
        <Input
          placeholder="Blocks count"
          name="blocksCount"
          id="blocksCount"
          type="number"
          min={1}
          step={1}
          required={true}
          defaultValue={1}
        />
      </div>
      <Button className="mt-4" size="sm" disabled={createBlocksLoading}>
        Add block(s)
      </Button>
    </form>
  );
};

export default CreateBlocksForm;
