
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

interface RejectionDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedRequest: any | null;
  comment: string;
  setComment: (comment: string) => void;
  onConfirm: () => void;
}

export const RejectionDialog = ({
  open,
  setOpen,
  selectedRequest,
  comment,
  setComment,
  onConfirm,
}: RejectionDialogProps) => {
  if (!selectedRequest) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Request</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this request.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Employee:</p>
              <p className="text-sm">{selectedRequest.userName}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Type:</p>
              <p className="text-sm">{selectedRequest.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Start Date:</p>
              <p className="text-sm">{format(new Date(selectedRequest.startDate), "MMM d, yyyy")}</p>
            </div>
            <div>
              <p className="text-sm font-medium">End Date:</p>
              <p className="text-sm">{format(new Date(selectedRequest.endDate), "MMM d, yyyy")}</p>
            </div>
          </div>
          
          <div>
            <Label htmlFor="comment" className="text-red-500">Reason for Rejection (Required)</Label>
            <Textarea
              id="comment"
              placeholder="Provide a reason for rejection..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border-red-200 focus-visible:ring-red-300"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="destructive">
            Confirm Rejection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
