import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export type CheckInStatus = "checked-in" | "checked-out" | "not-checked-in";

export type DailyActivity = {
  id: string;
  userId: string;
  date: Date;
  checkInTime: Date | null;
  checkOutTime: Date | null;
  status: CheckInStatus;
  activities: string;
  workingHours: number;
};

// In-memory storage for attendance data
let attendanceRecords: DailyActivity[] = [];

export const useAttendance = () => {
  const [todayRecord, setTodayRecord] = useState<DailyActivity | null>(null);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    if (currentUser) {
      // Get today's date (reset to midnight)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Find or create today's record
      let record = attendanceRecords.find(
        record => record.userId === currentUser.uid && 
                  isSameDay(new Date(record.date), today)
      );
      
      if (!record) {
        record = {
          id: Date.now().toString(),
          userId: currentUser.uid,
          date: today,
          checkInTime: null,
          checkOutTime: null,
          status: "not-checked-in",
          activities: "",
          workingHours: 0
        };
        attendanceRecords.push(record);
      }
      
      setTodayRecord(record);
    }
  }, [currentUser]);
  
  const checkIn = () => {
    if (todayRecord && currentUser) {
      const updatedRecord = {
        ...todayRecord,
        checkInTime: new Date(),
        status: "checked-in" as CheckInStatus,
        workingHours: 0
      };
      
      // Update in our "database"
      attendanceRecords = attendanceRecords.map(record => 
        record.id === updatedRecord.id ? updatedRecord : record
      );
      
      setTodayRecord(updatedRecord);
      return updatedRecord;
    }
  };
  
  const checkOut = (activities: string) => {
    if (todayRecord && currentUser && todayRecord.checkInTime) {
      const checkOutTime = new Date();
      const checkInTime = new Date(todayRecord.checkInTime);
      
      // Calculate working hours
      const diffMs = checkOutTime.getTime() - checkInTime.getTime();
      const workingHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100; // Round to 2 decimals
      
      const updatedRecord = {
        ...todayRecord,
        checkOutTime,
        status: "checked-out" as CheckInStatus,
        activities,
        workingHours
      };
      
      // Update in our "database"
      attendanceRecords = attendanceRecords.map(record => 
        record.id === updatedRecord.id ? updatedRecord : record
      );
      
      setTodayRecord(updatedRecord);
      return updatedRecord;
    }
  };
  
  return { todayRecord, checkIn, checkOut };
};

export const useAttendanceHistory = () => {
  const [records, setRecords] = useState<DailyActivity[]>([]);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    if (currentUser) {
      const userRecords = attendanceRecords.filter(
        record => record.userId === currentUser.uid
      );
      setRecords(userRecords);
    }
  }, [currentUser, attendanceRecords]);
  
  return { records };
};

// Helper function to check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}
