import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import {
  useDeleteBlockMutation,
  useUpdateBlockMutation,
} from '../../../api/block';
import { getErrorMessage } from '../../../utils/error';
import { toast } from 'sonner';

interface Block {
  _id: string;
  name: string;
}

type UpdateBlockProps = {
  block: Block | null;
  onDelete?: () => void;
};

const UpdateBlockForm = ({ block, onDelete }: UpdateBlockProps) => {
  const [updateBlock, { isLoading: updateBlockLoading }] =
    useUpdateBlockMutation();
  const [deleteBlock, { isLoading: deleteBlockLoading }] =
    useDeleteBlockMutation();

  const handleUpdateBlock = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const blockName = formData.get('blockName') as string;

    try {
      const payload = await updateBlock({
        id: block?._id,
        block: { name: blockName },
      }).unwrap();
      toast.success(payload.message);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  const handleDeleteBlock = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const payload = await deleteBlock({ id: block?._id }).unwrap();
      toast.success(payload.message);
      onDelete instanceof Function && onDelete();
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <form
      className="text-sm p-4 ring-1 ring-muted rounded-md mt-2"
      onSubmit={handleUpdateBlock}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="blockName">Block name</Label>
        <Input
          placeholder="Block name"
          name="blockName"
          id="blockName"
          type="text"
          required={true}
          defaultValue={block ? block.name : ''}
        />
      </div>
      <div className="flex gap-2 mt-4">
        <Button disabled={updateBlockLoading} type="submit" size="sm">
          Update block
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDeleteBlock}
          disabled={deleteBlockLoading}
        >
          Delete block
        </Button>
      </div>
    </form>
  );
};

export default UpdateBlockForm;
