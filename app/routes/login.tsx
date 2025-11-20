import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { useNavigate, type MetaFunction } from "react-router";
import { useAuth } from "~/context/authProvider";
import InputLayout from "~/components/ui/input-layout";
import { useState } from "react";
import { useToast } from "~/context/toastProvider";

export const meta: MetaFunction = () => {
  return [{ title: "Log In" }, { name: "description", content: "Log in" }];
};
// Define validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const message = await login(data.email, data.password);
      addToast(message, "success");
      navigate("/profile");
    } catch (error: any) {
      if (error.message) addToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <InputLayout
        label="Email"
        errMessage={errors.email && errors.email.message}
      >
        <input
          type="email"
          disabled={isSubmitting}
          placeholder="you@example.com"
          {...register("email")}
          className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
            errors.email
              ? "border-red-500 focus:ring-red-500/50"
              : "border-border focus:ring-primary/50"
          }`}
        />
      </InputLayout>

      <InputLayout
        label="Password"
        errMessage={errors.password && errors.password.message}
      >
        <input
          disabled={isSubmitting}
          type="password"
          placeholder="••••••••"
          {...register("password")}
          className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
            errors.password
              ? "border-red-500 focus:ring-red-500/50"
              : "border-border focus:ring-primary/50"
          }`}
        />
      </InputLayout>

      <Button
        className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Logging In..." : "Login"}
      </Button>
    </form>
  );
}

export default Login;
