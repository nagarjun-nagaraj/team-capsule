import { CalendarClock, Clock, CheckCircle, Calendar } from "lucide-react";
import AttendanceCard from "@/components/AttendanceCard";
import StatisticsCard from "@/components/StatisticsCard";
import LeaveRequestForm from "@/components/LeaveRequestForm";
import { useLeaveRequests } from "@/services/leaveRequestService";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAttendance, useAttendanceHistory } from "@/services/attendanceService";

const Dashboard = () => {
  const { requests } = useLeaveRequests();
  const { currentUser } = useAuth();
  const { records } = useAttendanceHistory();
  const [stats, setStats] = useState({
    daysPresent: 0,
    daysAbsent: 0,
    leaveDaysTaken: 0,
    workingHours: 0
  });

  // Calculate actual stats from attendance records and leave requests
  useEffect(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Calculate working days in the month so far
    const workingDaysInMonth = getWorkingDays(startOfMonth, now);
    
    // Filter requests for current month and approved status
    const approvedLeaves = requests.filter(req => {
      const reqStartDate = new Date(req.startDate);
      const reqEndDate = new Date(req.endDate);
      return (
        req.status === "approved" && 
        !req.isWorkFromHome && 
        ((reqStartDate >= startOfMonth && reqStartDate <= now) || 
         (reqEndDate >= startOfMonth && reqEndDate <= now))
      );
    });
    
    // Calculate leave days taken
    let leaveDaysTaken = 0;
    approvedLeaves.forEach(leave => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const effectiveStart = start < startOfMonth ? startOfMonth : start;
      const effectiveEnd = end > now ? now : end;
      
      const diffTime = Math.abs(effectiveEnd.getTime() - effectiveStart.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
      leaveDaysTaken += diffDays;
    });
    
    // Calculate present days from attendance records
    const presentDays = records.filter(record => {
      if (!record.checkInTime) return false;
      
      const recordDate = new Date(record.checkInTime);
      return recordDate >= startOfMonth && 
             recordDate <= now && 
             record.status === "checked-out";
    }).length;
    
    // Calculate working hours (based on actual attendance)
    let totalWorkingHours = 0;
    records.forEach(record => {
      if (record.checkInTime && record.checkOutTime) {
        const checkIn = new Date(record.checkInTime);
        const checkOut = new Date(record.checkOutTime);
        
        if (checkIn >= startOfMonth && checkIn <= now) {
          const diffMs = checkOut.getTime() - checkIn.getTime();
          const diffHours = diffMs / (1000 * 60 * 60);
          totalWorkingHours += diffHours;
        }
      }
    });
    
    // If we don't have enough attendance records, calculate based on present days
    if (totalWorkingHours === 0 && presentDays > 0) {
      totalWorkingHours = presentDays * 8; // Assuming 8 working hours per day
    }
    
    setStats({
      daysPresent: presentDays,
      daysAbsent: leaveDaysTaken,
      leaveDaysTaken,
      workingHours: Math.round(totalWorkingHours)
    });
  }, [requests, records]);

  // Helper function to calculate working days between two dates (excluding weekends)
  const getWorkingDays = (startDate: Date, endDate: Date) => {
    let count = 0;
    const curDate = new Date(startDate.getTime());
    while (curDate <= endDate) {
      const dayOfWeek = curDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) count++; // Skip weekends (0 = Sunday, 6 = Saturday)
      curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatisticsCard
          title="Days Present"
          value={stats.daysPresent.toString()}
          icon={<CheckCircle className="h-4 w-4" />}
          description="This month"
        />
        <StatisticsCard
          title="Days Absent"
          value={stats.daysAbsent.toString()}
          icon={<Clock className="h-4 w-4" />}
          description="This month"
        />
        <StatisticsCard
          title="Leave Days Taken"
          value={stats.leaveDaysTaken.toString()}
          icon={<Calendar className="h-4 w-4" />}
          description="This month"
        />
        <StatisticsCard
          title="Working Hours"
          value={stats.workingHours.toString()}
          icon={<CalendarClock className="h-4 w-4" />}
          description="This month"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AttendanceCard />
        </div>
        <div className="lg:col-span-2">
          <LeaveRequestForm />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
