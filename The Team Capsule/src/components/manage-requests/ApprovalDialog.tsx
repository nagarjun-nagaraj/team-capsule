
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

interface ApprovalDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedRequest: any | null;
  comment: string;
  setComment: (comment: string) => void;
  onConfirm: () => void;
}

export const ApprovalDialog = ({
  open,
  setOpen,
  selectedRequest,
  comment,
  setComment,
  onConfirm,
}: ApprovalDialogProps) => {
  if (!selectedRequest) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Request</DialogTitle>
          <DialogDescription>
            Please provide feedback for the employee regarding this approval.
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
            <Label htmlFor="comment" className="text-green-500">Approval Comment (Required)</Label>
            <Textarea
              id="comment"
              placeholder="Add feedback for the employee..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border-green-200 focus-visible:ring-green-300"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-green-500 hover:bg-green-600">
            Confirm Approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
