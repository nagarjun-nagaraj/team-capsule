
import ProfileCard from "@/components/ProfileCard";

const Profile = () => {
  // Demo profile data - in a real app this would come from an API or context
  const profileData = {
    name: "Alex Johnson",
    role: "Software Developer",
    department: "Engineering",
    email: "alex.johnson@example.com",
    phone: "555-123-4567",
    leaveBalance: {
      sick: 7,
      vacation: 15,
      personal: 3,
    },
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="max-w-md mx-auto">
        <ProfileCard {...profileData} />
      </div>
    </div>
  );
};

export default Profile;
