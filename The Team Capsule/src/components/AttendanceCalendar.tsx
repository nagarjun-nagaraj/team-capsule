
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Check, Home, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLeaveRequests, LeaveRequest, useAllLeaveRequests } from "@/services/leaveRequestService";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for holidays and attendance
const HOLIDAYS = [
  { date: new Date(2024, 3, 15), name: "Good Friday" },
  { date: new Date(2024, 4, 1), name: "Labor Day" },
  { date: new Date(2024, 4, 15), name: "Memorial Day" },
  { date: new Date(2024, 6, 4), name: "Independence Day" },
];

const MOCK_ATTENDANCE = [
  { date: new Date(2024, 3, 1), status: "present" },
  { date: new Date(2024, 3, 2), status: "present" },
  { date: new Date(2024, 3, 3), status: "wfh" },
  { date: new Date(2024, 3, 6), status: "present" },
  { date: new Date(2024, 3, 7), status: "present" },
  { date: new Date(2024, 3, 8), status: "absent" },
  { date: new Date(2024, 3, 9), status: "wfh" },
  { date: new Date(2024, 3, 10), status: "wfh" },
  { date: new Date(2024, 3, 13), status: "present" },
  { date: new Date(2024, 3, 14), status: "present" },
];

type DayInfo = {
  date: Date;
  isHoliday?: boolean;
  holidayName?: string;
  isLeave?: boolean;
  leaveStatus?: string;
  leaveType?: string;
  isWorkFromHome?: boolean;
  attendanceStatus?: string;
  managerComment?: string;
};

const AttendanceCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [calendarData, setCalendarData] = useState<Map<string, DayInfo>>(new Map());
  const [selectedDayInfo, setSelectedDayInfo] = useState<DayInfo | null>(null);
  const { currentUser } = useAuth();
  const { requests: userRequests } = useLeaveRequests();
  const { requests: allRequests } = useAllLeaveRequests();
  
  // Prepare calendar data
  useEffect(() => {
    const data = new Map<string, DayInfo>();
    
    // Add holidays
    HOLIDAYS.forEach(holiday => {
      const dateKey = formatDateKey(holiday.date);
      data.set(dateKey, {
        date: holiday.date,
        isHoliday: true,
        holidayName: holiday.name
      });
    });
    
    // Add attendance data
    MOCK_ATTENDANCE.forEach(record => {
      const dateKey = formatDateKey(record.date);
      const existing = data.get(dateKey) || { date: record.date };
      data.set(dateKey, {
        ...existing,
        attendanceStatus: record.status
      });
    });
    
    // Add leave and WFH requests data - use the actual requests from leaveRequestService
    const requests = currentUser ? userRequests : allRequests;
    
    requests.forEach(leave => {
      // Skip if not approved
      if (leave.status !== "approved") return;
      
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      
      // Handle date ranges
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateKey = formatDateKey(currentDate);
        const existing = data.get(dateKey) || { date: new Date(currentDate) };
        
        if (leave.isWorkFromHome) {
          // For WFH requests
          data.set(dateKey, {
            ...existing,
            isWorkFromHome: true,
            attendanceStatus: "wfh",
            managerComment: leave.managerComment
          });
        } else {
          // For standard leave requests
          data.set(dateKey, {
            ...existing,
            isLeave: true,
            leaveStatus: leave.status,
            leaveType: leave.type,
            managerComment: leave.managerComment
          });
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    
    setCalendarData(data);
  }, [currentUser, userRequests, allRequests]);
  
  // Helper function for formatting date keys
  const formatDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };
  
  const handleDayClick = (day: Date | undefined) => {
    if (day) {
      const dateKey = formatDateKey(day);
      const info = calendarData.get(dateKey);
      setSelectedDayInfo(info || { date: day });
    } else {
      setSelectedDayInfo(null);
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-500">Present</Badge>;
      case "absent":
        return <Badge className="bg-red-500">Absent</Badge>;
      case "wfh":
        return <Badge className="bg-blue-500">WFH</Badge>;
      default:
        return null;
    }
  };

  // Custom css class based on day info
  const getDayClass = (date: Date) => {
    const dateKey = formatDateKey(date);
    const dayInfo = calendarData.get(dateKey);
    
    if (dayInfo?.isHoliday) {
      return "bg-red-100 text-red-700";
    } else if (dayInfo?.isLeave && dayInfo.leaveStatus === "approved") {
      return "bg-blue-100 text-blue-700";
    } else if (dayInfo?.isWorkFromHome) {
      return "bg-indigo-100 text-indigo-700";
    }
    
    return "";
  };

  // Custom decorator for days
  const getDayIndicator = (date: Date) => {
    const dateKey = formatDateKey(date);
    const dayInfo = calendarData.get(dateKey);
    
    if (dayInfo?.attendanceStatus === "present") {
      return <Check className="h-3 w-3 text-green-500 absolute bottom-1 right-1" />;
    } else if (dayInfo?.attendanceStatus === "absent") {
      return <X className="h-3 w-3 text-red-500 absolute bottom-1 right-1" />;
    } else if (dayInfo?.attendanceStatus === "wfh" || dayInfo?.isWorkFromHome) {
      return <Home className="h-3 w-3 text-blue-500 absolute bottom-1 right-1" />;
    }
    
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5" />
            Attendance Calendar
          </CardTitle>
          <CardDescription>
            View your attendance, leaves, and holidays
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(day) => {
                setDate(day);
                handleDayClick(day);
              }}
              className="rounded-md border"
              modifiers={{
                holiday: (date) => {
                  const dateKey = formatDateKey(date);
                  const dayInfo = calendarData.get(dateKey);
                  return !!dayInfo?.isHoliday;
                },
                approved: (date) => {
                  const dateKey = formatDateKey(date);
                  const dayInfo = calendarData.get(dateKey);
                  return !!dayInfo?.isLeave && dayInfo.leaveStatus === "approved";
                },
                wfh: (date) => {
                  const dateKey = formatDateKey(date);
                  const dayInfo = calendarData.get(dateKey);
                  return !!dayInfo?.isWorkFromHome || dayInfo?.attendanceStatus === "wfh";
                }
              }}
              modifiersClassNames={{
                holiday: "bg-red-100 text-red-700",
                approved: "bg-blue-100 text-blue-700",
                wfh: "bg-indigo-100 text-indigo-700"
              }}
              components={{
                DayContent: ({ date, ...props }) => (
                  <div className="relative h-full w-full flex items-center justify-center">
                    <span>{date.getDate()}</span>
                    {getDayIndicator(date)}
                  </div>
                ),
              }}
            />
          </div>
          
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-red-100"></div>
              <span className="ml-1 text-xs">Holiday</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-blue-100"></div>
              <span className="ml-1 text-xs">Approved Leave</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-indigo-100"></div>
              <span className="ml-1 text-xs">Work From Home</span>
            </div>
            <div className="flex items-center">
              <Check className="h-3 w-3 text-green-500" />
              <span className="ml-1 text-xs">Present</span>
            </div>
            <div className="flex items-center">
              <X className="h-3 w-3 text-red-500" />
              <span className="ml-1 text-xs">Absent</span>
            </div>
            <div className="flex items-center">
              <Home className="h-3 w-3 text-blue-500" />
              <span className="ml-1 text-xs">WFH</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Day Details</CardTitle>
          <CardDescription>
            Information for selected day
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDayInfo ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedDayInfo.date.toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
              </div>
              
              {selectedDayInfo.isHoliday && (
                <div className="p-3 bg-red-50 rounded-md">
                  <h4 className="font-medium text-red-800">Holiday</h4>
                  <p className="text-sm text-red-700">{selectedDayInfo.holidayName}</p>
                </div>
              )}
              
              {selectedDayInfo.isLeave && (
                <div className={cn(
                  "p-3 rounded-md",
                  selectedDayInfo.leaveStatus === "approved" ? "bg-blue-50" : "bg-yellow-50"
                )}>
                  <h4 className="font-medium">
                    {selectedDayInfo.leaveType} ({selectedDayInfo.leaveStatus})
                  </h4>
                  {selectedDayInfo.managerComment && (
                    <p className="text-sm mt-1">
                      <span className="font-medium">Manager comment:</span> {selectedDayInfo.managerComment}
                    </p>
                  )}
                </div>
              )}
              
              {selectedDayInfo.isWorkFromHome && (
                <div className="p-3 bg-indigo-50 rounded-md">
                  <h4 className="font-medium text-indigo-800">Work From Home</h4>
                  {selectedDayInfo.managerComment && (
                    <p className="text-sm mt-1">
                      <span className="font-medium">Manager comment:</span> {selectedDayInfo.managerComment}
                    </p>
                  )}
                </div>
              )}
              
              {selectedDayInfo.attendanceStatus && !selectedDayInfo.isWorkFromHome && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Attendance status:</p>
                  <div className="mt-1">{getStatusLabel(selectedDayInfo.attendanceStatus)}</div>
                </div>
              )}
              
              {!selectedDayInfo.isHoliday && 
               !selectedDayInfo.isLeave && 
               !selectedDayInfo.isWorkFromHome && 
               !selectedDayInfo.attendanceStatus && (
                <div className="text-center py-8 text-gray-500">
                  <p>No data available for this day</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Select a day to view details</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceCalendar;
