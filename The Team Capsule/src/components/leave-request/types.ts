
export type FormValues = {
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  isWorkFromHome: boolean;
};

export function getLeaveTypeDisplay(type: string): string {
  const typeMap: {[key: string]: string} = {
    'sick': 'Sick Leave',
    'vacation': 'Vacation',
    'personal': 'Personal Leave',
    'wfh': 'Work From Home',
    'other': 'Other'
  };
  return typeMap[type] || type;
}
