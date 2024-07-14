import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useGetActionAuditLogsQuery } from '../../api/logs';
import { useState } from 'react';
import { Button } from '../ui/button';
import Loading from '../Loading';
import { formatDateTime } from '../../utils/time';
import ClearActionAuditLogs from './Actions/ClearActionAuditLogs';
import { Info, CircleAlert, TriangleAlert } from 'lucide-react';

const ACTION_MAPPING = {
  CREATE_BUILDING: { name: 'Create Building', level: 'low' },
  DELETE_BUILDING: { name: 'Delete Building', level: 'high' },
  PREDICT_ALLOCATION: { name: 'Predict Allocation', level: 'low' },
  ALLOCATE_ROOMS: { name: 'Allocate Rooms', level: 'medium' },
  CLEAR_ALLOCATION: { name: 'Clear Allocation', level: 'high' },
  RESET_BUILDING: { name: 'Reset Building', level: 'high' },
  CLEAR_ACTION_LOGS: { name: 'Clear Action Logs', level: 'high' },
};

interface Log {
  _id: string;
  action: keyof typeof ACTION_MAPPING;
  triggeredBy: {
    name: string;
  };
  building?: {
    name: string;
  };
  createdAt: string;
}

const ActionAuditLogs = () => {
  const [page, setPage] = useState(1);
  const { data: { logs = [] } = {}, isFetching: isFetchingLogs } =
    useGetActionAuditLogsQuery<{ data: { logs: Log[] }; isFetching: boolean }>({
      limit: 10,
      offset: (page - 1) * 10,
    });

  const nextPage = () => {
    if (logs.length < 10) {
      return;
    }
    setPage(page + 1);
  };

  const prevPage = () => {
    if (page === 1) {
      return;
    }
    setPage(page - 1);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h1 className="font-semibold">Audit Logs</h1>
        <p className="text-muted-foreground text-sm">
          Here you can view all the actions performed by the admin. This is
          useful for tracking the changes made by the admin.
        </p>
      </div>
      <Table>
        <TableCaption>Actions performed by the admin</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead className="min-w-32">Triggered By</TableHead>
            <TableHead className="min-w-32">Triggered At</TableHead>
            <TableHead>Building</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isFetchingLogs ? (
            <TableRow>
              <TableCell colSpan={4}>
                <Loading show />
              </TableCell>
            </TableRow>
          ) : logs.length > 0 ? (
            logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <span>
                      {ACTION_MAPPING[log.action].level === 'low' ? (
                        <Info size={16} className="stroke-primary" />
                      ) : ACTION_MAPPING[log.action].level === 'medium' ? (
                        <CircleAlert
                          size={16}
                          className="stroke-amber-600 dark:stroke-amber-500"
                        />
                      ) : (
                        <TriangleAlert
                          size={16}
                          className="stroke-red-600 dark:stroke-red-500"
                        />
                      )}{' '}
                    </span>
                    {ACTION_MAPPING[log.action].name}
                  </div>
                </TableCell>
                <TableCell>{log.triggeredBy.name}</TableCell>
                <TableCell>{formatDateTime(log.createdAt)}</TableCell>
                <TableCell>{log?.building?.name || '-'}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No logs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell className="w-32">
              <ClearActionAuditLogs helpText={false} />
            </TableCell>
            <TableCell colSpan={3} className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevPage}
                disabled={page === 1}
                className="cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextPage}
                disabled={logs.length < 10}
                className="cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default ActionAuditLogs;
