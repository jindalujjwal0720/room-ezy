import { Input } from '../../ui/input';
import { Button, buttonVariants } from '../../ui/button';
import { Label } from '../../ui/label';
import {
  useDeleteBlockMutation,
  useUpdateBlockMutation,
} from '../../../api/block';
import { getErrorMessage } from '../../../utils/error';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../ui/alert-dialog';

interface BuildingBlock {
  _id: string;
  name: string;
}

type UpdateBlockProps = {
  block: BuildingBlock | null;
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
      className="text-sm p-4 ring-1 ring-muted rounded-md"
      onSubmit={handleUpdateBlock}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="blockName">BuildingBlock name</Label>
        <Input
          placeholder="BuildingBlock name"
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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              disabled={deleteBlockLoading}
              variant="destructive"
            >
              Delete block
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete BuildingBlock</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Are you sure you want to delete the block{' '}
              <strong>{block?.name}</strong>?
              <div className="text-sm text-muted-foreground mt-2">
                This will:
                <ul className="list-disc pl-8">
                  <li>Delete all the floors in the block</li>
                  <li>Delete all the rooms in the block</li>
                  <li>
                    <span className="text-red-500">Unallocate</span> all the
                    students in the block
                  </li>
                </ul>
              </div>
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={handleDeleteBlock}
                className={buttonVariants({
                  variant: 'destructive',
                  size: 'sm',
                })}
              >
                Delete
              </AlertDialogAction>
              <AlertDialogCancel
                className={buttonVariants({ variant: 'secondary', size: 'sm' })}
              >
                Cancel
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </form>
  );
};

export default UpdateBlockForm;
