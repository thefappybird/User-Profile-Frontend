interface TabsProps {
  handleRegisterClick: () => void;
  handleLoginClick: () => void;
  isLogin: boolean;
  isRegister: boolean;
}

function Tabs({
  handleRegisterClick,
  handleLoginClick,
  isLogin,
  isRegister,
}: TabsProps) {
  return (
    <div className="flex gap-2 mb-8 p-1 bg-secondary rounded-lg">
      <button
        onClick={handleLoginClick}
        className={`flex-1 px-4 py-2.5 rounded-md font-medium transition-all duration-200 ${
          isLogin
            ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Login
      </button>
      <button
        onClick={handleRegisterClick}
        className={`flex-1 px-4 py-2.5 rounded-md font-medium transition-all duration-200 ${
          isRegister
            ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Register
      </button>
    </div>
  );
}

export default Tabs;
