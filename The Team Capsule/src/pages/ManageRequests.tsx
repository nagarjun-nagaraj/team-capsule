import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { useAllLeaveRequests, updateLeaveRequestStatus } from "@/services/leaveRequestService";
import { RequestsTable } from "@/components/manage-requests/RequestsTable";
import { ApprovalDialog } from "@/components/manage-requests/ApprovalDialog";
import { RejectionDialog } from "@/components/manage-requests/RejectionDialog";
import { AttendanceTable } from "@/components/manage-requests/AttendanceTable";

const ManageRequests = () => {
  const { toast: uiToast } = useToast();
  const { requests } = useAllLeaveRequests();
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [comment, setComment] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleApprove = (request: any) => {
    setSelectedRequest(request);
    setShowApprovalDialog(true);
  };

  const handleReject = (request: any) => {
    setSelectedRequest(request);
    setShowRejectionDialog(true);
  };

  const confirmApproval = () => {
    if (selectedRequest && comment.trim()) {
      updateLeaveRequestStatus(selectedRequest.id, "approved", comment);
      
      uiToast({
        title: "Request Approved",
        description: `${selectedRequest.type} request from ${selectedRequest.userName} has been approved.`,
      });
      
      toast.success(`${selectedRequest.type} request approved`);
      setShowApprovalDialog(false);
      setComment("");
    } else if (!comment.trim()) {
      toast.error("Please provide a comment");
    }
  };

  const confirmRejection = () => {
    if (selectedRequest && comment.trim()) {
      updateLeaveRequestStatus(selectedRequest.id, "rejected", comment);
      
      uiToast({
        title: "Request Rejected",
        description: `${selectedRequest.type} request from ${selectedRequest.userName} has been rejected.`,
      });
      
      toast.error(`${selectedRequest.type} request rejected`);
      setShowRejectionDialog(false);
      setComment("");
    } else if (!comment.trim()) {
      toast.error("Please provide a reason for rejection");
    }
  };

  const pendingRequests = requests.filter(r => r.status === "pending");
  const otherRequests = requests.filter(r => r.status !== "pending");
  const sortedRequests = [...pendingRequests, ...otherRequests];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Manager Approval Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Team Attendance</CardTitle>
          <CardDescription>
            View team members' attendance and daily activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AttendanceTable />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Team Requests</CardTitle>
          <CardDescription>
            Review and approve/reject employee leave and work from home requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedRequests.length > 0 ? (
            <RequestsTable 
              requests={sortedRequests} 
              onApprove={handleApprove} 
              onReject={handleReject} 
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No leave requests to review</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ApprovalDialog
        open={showApprovalDialog}
        setOpen={setShowApprovalDialog}
        selectedRequest={selectedRequest}
        comment={comment}
        setComment={setComment}
        onConfirm={confirmApproval}
      />

      <RejectionDialog
        open={showRejectionDialog}
        setOpen={setShowRejectionDialog}
        selectedRequest={selectedRequest}
        comment={comment}
        setComment={setComment}
        onConfirm={confirmRejection}
      />
    </div>
  );
};

export default ManageRequests;
