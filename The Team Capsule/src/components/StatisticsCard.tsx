
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatisticsCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  className?: string;
};

const StatisticsCard = ({
  title,
  value,
  icon,
  description,
  className,
}: StatisticsCardProps) => {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-blue-500">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
