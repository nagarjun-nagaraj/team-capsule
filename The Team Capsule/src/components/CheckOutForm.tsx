
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

type CheckOutFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (activities: string) => void;
};

const CheckOutForm = ({ open, onOpenChange, onSubmit }: CheckOutFormProps) => {
  const [activities, setActivities] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!activities.trim()) {
      toast({
        title: "Error",
        description: "Please provide information about your daily activities.",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(activities);
    setActivities("");
    onOpenChange(false);
    
    toast({
      title: "Checked Out Successfully",
      description: "Your day has been logged. See you tomorrow!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Check Out for Today</DialogTitle>
          <DialogDescription>
            Please provide a summary of what you accomplished today.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="activities">Today's Activities</Label>
            <Textarea
              id="activities"
              placeholder="List your accomplishments, challenges, and any pending tasks..."
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Submit & Check Out
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckOutForm;
