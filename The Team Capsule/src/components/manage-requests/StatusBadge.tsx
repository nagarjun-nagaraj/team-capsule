
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-500">Approved</Badge>;
    case "rejected":
      return <Badge className="bg-red-500">Rejected</Badge>;
    default:
      return <Badge className="bg-yellow-500">Pending</Badge>;
  }
};
