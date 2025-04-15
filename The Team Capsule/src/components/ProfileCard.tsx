
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ProfileCardProps = {
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  leaveBalance: {
    sick: number;
    vacation: number;
    personal: number;
  };
};

const ProfileCard = ({
  name,
  role,
  department,
  email,
  phone,
  leaveBalance,
}: ProfileCardProps) => {
  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src="" alt={name} />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{name}</CardTitle>
            <CardDescription>{role}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid gap-2">
          <div className="flex justify-between py-1">
            <dt className="text-sm font-medium text-gray-500">Department</dt>
            <dd className="text-sm text-gray-900">{department}</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="text-sm text-gray-900">{email}</dd>
          </div>
          <div className="flex justify-between py-1">
            <dt className="text-sm font-medium text-gray-500">Phone</dt>
            <dd className="text-sm text-gray-900">{phone}</dd>
          </div>
          <div className="border-t my-2"></div>
          <div>
            <h4 className="text-sm font-medium mb-2">Leave Balance</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-500">Sick</p>
                <p className="font-medium">{leaveBalance.sick} days</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-500">Vacation</p>
                <p className="font-medium">{leaveBalance.vacation} days</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-500">Personal</p>
                <p className="font-medium">{leaveBalance.personal} days</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Edit Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
