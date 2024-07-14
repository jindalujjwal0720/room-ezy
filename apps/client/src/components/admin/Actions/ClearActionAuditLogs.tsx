import { useState } from 'react';
import { Button } from '../../ui/button';
import { toast } from 'sonner';
import { getErrorMessage } from '../../../utils/error';

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
import { useClearActionAuditLogsMutation } from '../../../api/logs';

const ClearActionAuditLogs = ({ helpText = true }: { helpText?: boolean }) => {
  const [clearLogs, { isLoading: isClearingLogs }] =
    useClearActionAuditLogsMutation();
  const [openClearAlert, setOpenClearAlert] = useState(false);

  const handleClearAllotments = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    try {
      await clearLogs({}).unwrap();
      toast.success('Logs cleared successfully');
      setOpenClearAlert(false);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <AlertDialog open={openClearAlert} onOpenChange={setOpenClearAlert}>
        <AlertDialogTrigger asChild>
          <Button
            className="w-full hover:bg-destructive text-destructive hover:text-destructive-foreground"
            size="sm"
            variant="outline"
            disabled={isClearingLogs}
          >
            Clear Action Logs
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Action Logs</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to clear all the action logs?
            <div className="text-sm text-muted-foreground mt-2">
              This will:
              <ul className="list-disc pl-8">
                <li>Clear all the action logs from the system.</li>
                <li>
                  be <strong>irreversible</strong> and you will not be able to
                  recover the logs.
                </li>
                <li>Create a new log entry for this action.</li>
              </ul>
            </div>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleClearAllotments}>
              Yes, clear
            </AlertDialogAction>
            <AlertDialogCancel>No, cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {helpText && (
        <p className="text-xs text-muted-foreground">
          <strong className="text-destructive">Irreversible Warning:</strong>{' '}
          Clear all the action logs from the system.
        </p>
      )}
    </div>
  );
};

export default ClearActionAuditLogs;
