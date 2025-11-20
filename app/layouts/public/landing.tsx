import { Outlet, useLocation, useNavigate } from "react-router";
import PublicHeader from "~/components/public/public-header";
import Tabs from "~/components/public/tabs";

function Landing() {
  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = location.pathname === "/";
  const isRegister = location.pathname === "/register";

  const handleLoginClick = () => navigate("");
  const handleRegisterClick = () => navigate("register");
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-background via-background to-secondary flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md">
        <PublicHeader />
        <div className="bg-card border border-border rounded-xl p-8 backdrop-blur-sm">
          <Tabs
            handleLoginClick={handleLoginClick}
            handleRegisterClick={handleRegisterClick}
            isLogin={isLogin}
            isRegister={isRegister}
          />
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Landing;
