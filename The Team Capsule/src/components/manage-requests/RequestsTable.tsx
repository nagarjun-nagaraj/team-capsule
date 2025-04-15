
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Check, User, X } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { RequestTypeIcon } from "./RequestTypeIcon";

interface RequestsTableProps {
  requests: any[];
  onApprove: (request: any) => void;
  onReject: (request: any) => void;
}

export const RequestsTable = ({ requests, onApprove, onReject }: RequestsTableProps) => {
  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No pending requests to review</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Requested On</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                {request.userName}
              </div>
            </TableCell>
            <TableCell className="font-medium">
              <div className="flex items-center">
                <RequestTypeIcon request={request} />
                {request.type}
              </div>
            </TableCell>
            <TableCell>
              {format(new Date(request.startDate), "MMM d")}
              {!isSameDay(new Date(request.startDate), new Date(request.endDate)) &&
                ` - ${format(new Date(request.endDate), "MMM d")}`}
            </TableCell>
            <TableCell>
              {format(new Date(request.requestedOn), "MMM d, yyyy")}
            </TableCell>
            <TableCell className="max-w-[150px] truncate">
              {request.reason}
            </TableCell>
            <TableCell><StatusBadge status={request.status} /></TableCell>
            <TableCell>
              {request.status === "pending" && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => onApprove(request)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onReject(request)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Helper function to check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}
