import { useState } from "react";
import { UserProfileCard } from "./private/user-profile-card";
import { ActivityLogSection } from "./private/activity-log/activity-log-section";
import { EditProfileModal } from "./private/edit-profile-modal";
import { useAuth } from "~/context/authProvider";

export function Dashboard() {
  const { user } = useAuth();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* User Profile Section */}
      <UserProfileCard
        user={user}
        onEditClick={() => setIsEditModalOpen(true)}
      />

      <ActivityLogSection />

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          onClose={() => setIsEditModalOpen(false)}
          user={user}
        />
      )}
    </div>
  );
}
