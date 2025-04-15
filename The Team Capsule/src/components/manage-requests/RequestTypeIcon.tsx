
import { CalendarClock, Home } from "lucide-react";

interface RequestTypeIconProps {
  request: {
    isWorkFromHome: boolean;
  };
}

export const RequestTypeIcon = ({ request }: RequestTypeIconProps) => {
  if (request.isWorkFromHome) {
    return <Home className="mr-1 h-4 w-4" />;
  }
  return <CalendarClock className="mr-1 h-4 w-4" />;
};
