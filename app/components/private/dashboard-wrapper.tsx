import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "~/context/authProvider";
import { LogsProvider } from "~/context/logsProvider";
import { useToast } from "~/context/toastProvider";
import type { User } from "~/utils/types/user";
import { Button } from "../ui/button";

export function DashboardLayout({
  currentUser,
  children,
}: {
  currentUser: User;
  children: React.ReactNode;
}) {
  const { setUser } = useAuth();
  const { addToast } = useToast();
  useEffect(() => {
    setUser(currentUser);
  }, []);

  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = async () => {
    try {
      const message = await logout();
      addToast(message, "success");
      navigate("");
    } catch (error: any) {
      if (error.message) addToast(error.message, "error");
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-background via-background to-secondary">
      <header className="relative z-10 border-b border-border backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <Button
            onClick={handleLogout}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Logout
          </Button>
        </div>
      </header>
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <LogsProvider>{children}</LogsProvider>
        </div>
      </main>
    </div>
  );
}
