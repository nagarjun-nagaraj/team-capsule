
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarDays, Check, X } from "lucide-react";
import LeaveRequestForm from "@/components/LeaveRequestForm";
import { useLeaveRequests } from "@/services/leaveRequestService";

const LeaveRequests = () => {
  const { requests } = useLeaveRequests();
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Force refresh when navigating to this page
  useEffect(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Leave Requests</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "View Requests" : "New Request"}
        </Button>
      </div>

      {showForm ? (
        <LeaveRequestForm />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Request History</CardTitle>
            <CardDescription>
              View all your leave requests and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Requested On</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.type}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarDays className="mr-1 h-3 w-3" />
                          {format(new Date(request.startDate), "MMM d")}
                          {!isSameDay(new Date(request.startDate), new Date(request.endDate)) &&
                            ` - ${format(new Date(request.endDate), "MMM d")}`}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(request.requestedOn), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {request.reason}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No leave requests found</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
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

export default LeaveRequests;
