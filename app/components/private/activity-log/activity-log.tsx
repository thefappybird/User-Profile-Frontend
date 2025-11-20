import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  action: string;
  timestamp: string;
  user_id: string;
  User: {
    name: string;
  };
}

interface ActivityLogProps {
  activities: Activity[];
}

const actionIcons: Record<string, string> = {
  "User Login": "🔐",
  "Profile Updated": "✏️",
  "Password Changed": "🔑",
  "User Logout": "🚪",
};

export function ActivityLog({ activities }: ActivityLogProps) {
  if (activities.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 backdrop-blur-sm text-center">
        <p className="text-muted-foreground">No activities found</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="divide-y divide-border">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="p-6 hover:bg-secondary/30 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-xl shrink-0">
                {actionIcons[activity.action] || "📝"}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-lg font-semibold text-foreground">
                    {activity.action}
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  by {activity.User.name}
                </p>
                <p className="text-xs text-muted-foreground/70">
                  {formatDistanceToNow(new Date(activity.timestamp), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div className="text-right shrink-0">
                <time className="text-sm text-muted-foreground">
                  {new Date(activity.timestamp).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
