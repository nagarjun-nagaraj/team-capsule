
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Timer, AlarmCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAttendance } from "@/services/attendanceService";
import { useAuth } from "@/contexts/AuthContext";
import CheckOutForm from "./CheckOutForm";

const AttendanceCard = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { todayRecord, checkIn, checkOut } = useAttendance();
  const [showCheckOutForm, setShowCheckOutForm] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  // Update clock every second if checked in
  const startTimer = () => {
    if (timerInterval) return;
    
    const interval = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    setTimerInterval(interval);
  };

  const stopTimer = () => {
    if (timerInterval) {
      window.clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const handleCheckIn = () => {
    if (!currentUser) return;
    
    checkIn();
    startTimer();
    
    toast({
      title: "Checked In",
      description: `You have successfully checked in at ${formatTime(new Date())}`,
    });
  };

  const handleCheckOut = (activities: string) => {
    if (!currentUser) return;
    
    checkOut(activities);
    stopTimer();
  };

  const getWorkingTime = () => {
    if (!todayRecord || !todayRecord.checkInTime) return "00:00:00";
    
    const startTime = new Date(todayRecord.checkInTime);
    const endTime = todayRecord.status === "checked-out" 
      ? new Date(todayRecord.checkOutTime!) 
      : currentTime;
      
    const diffMs = endTime.getTime() - startTime.getTime();
    
    // Format as HH:MM:SS
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // If user is checked in, start the timer
  if (todayRecord?.status === "checked-in" && !timerInterval) {
    startTimer();
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Today's Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="text-4xl font-bold">{getWorkingTime()}</div>
            <div className="text-sm text-gray-500">
              {todayRecord?.status === "checked-in" && "Currently working"}
              {todayRecord?.status === "checked-out" && "Checked out for today"}
              {todayRecord?.status === "not-checked-in" && "Not checked in yet"}
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full">
              {todayRecord?.status === "not-checked-in" && (
                <Button 
                  onClick={handleCheckIn}
                  className="col-span-2 bg-green-500 hover:bg-green-600"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Check In
                </Button>
              )}
              
              {todayRecord?.status === "checked-in" && (
                <Button 
                  onClick={() => setShowCheckOutForm(true)}
                  variant="destructive"
                  className="col-span-2"
                >
                  <AlarmCheck className="mr-2 h-4 w-4" />
                  Check Out
                </Button>
              )}
              
              {todayRecord?.status === "checked-out" && (
                <div className="col-span-2 text-center text-sm">
                  <p className="font-medium">
                    Checked in: {todayRecord.checkInTime ? formatTime(new Date(todayRecord.checkInTime)) : "--"}
                  </p>
                  <p className="font-medium">
                    Checked out: {todayRecord.checkOutTime ? formatTime(new Date(todayRecord.checkOutTime)) : "--"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <CheckOutForm
        open={showCheckOutForm}
        onOpenChange={setShowCheckOutForm}
        onSubmit={handleCheckOut}
      />
    </>
  );
};

function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  return `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

export default AttendanceCard;
