
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DailyActivity, useAttendanceHistory } from "@/services/attendanceService";

export const AttendanceTable = () => {
  const { records } = useAttendanceHistory();
  const [todayRecords, setTodayRecords] = useState<DailyActivity[]>([]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const filtered = records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getTime() === today.getTime();
    });
    
    setTodayRecords(filtered);
  }, [records]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User ID</TableHead>
          <TableHead>Check In</TableHead>
          <TableHead>Check Out</TableHead>
          <TableHead>Working Hours</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Activities</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {todayRecords.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{record.userId}</TableCell>
            <TableCell>
              {record.checkInTime 
                ? new Date(record.checkInTime).toLocaleTimeString() 
                : '-'}
            </TableCell>
            <TableCell>
              {record.checkOutTime 
                ? new Date(record.checkOutTime).toLocaleTimeString() 
                : '-'}
            </TableCell>
            <TableCell>{record.workingHours || '-'}</TableCell>
            <TableCell>{record.status}</TableCell>
            <TableCell className="max-w-md truncate">
              {record.activities || '-'}
            </TableCell>
          </TableRow>
        ))}
        {todayRecords.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              No attendance records for today
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
