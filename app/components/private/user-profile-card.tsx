import type { User } from "~/utils/types/user";
import { Button } from "../ui/button";

interface UserProfileCardProps {
  user: User | null;
  onEditClick: () => void;
}

export function UserProfileCard({ user, onEditClick }: UserProfileCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-8 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-xl bg-linear-to-br from-primary to-primary/50 flex items-center justify-center">
            <span className="text-4xl font-bold text-primary-foreground">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Full Name</p>
              <h3 className="text-2xl font-bold text-foreground">
                {user?.name}
              </h3>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Email Address
              </p>
              <p className="text-foreground">{user?.email}</p>
            </div>
            <Button
              onClick={onEditClick}
              className="bg-primary text-primary-foreground hover:bg-primary/90 md:hidden block"
            >
              Edit Profile
            </Button>
          </div>
        </div>
        <Button
          onClick={onEditClick}
          className="bg-primary text-primary-foreground hover:bg-primary/90 sm:block hidden"
        >
          Edit Profile
        </Button>
      </div>
    </div>
  );
}
