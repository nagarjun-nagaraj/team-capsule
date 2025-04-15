
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";

interface PayslipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const PayslipDialog = ({ open, onOpenChange }: PayslipDialogProps) => {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  
  const handleDownload = () => {
    if (!selectedMonth) return;
    console.log(`Downloading payslip for ${selectedMonth}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Download Payslip</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month} {new Date().getFullYear()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleDownload} 
            disabled={!selectedMonth}
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Payslip
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
