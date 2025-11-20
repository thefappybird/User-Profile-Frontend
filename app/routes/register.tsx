import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { useNavigate, type MetaFunction } from "react-router";
import InputLayout from "~/components/ui/input-layout";
import { authService } from "~/utils/authService";
import { useState } from "react";
import { useToast } from "~/context/toastProvider";
export const meta: MetaFunction = () => {
  return [{ title: "Register" }, { name: "description", content: "Register" }];
};
// Define validation schema
const registerSchema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function Register() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      console.log(data);

      const response = await authService.register(data);
      addToast(response.message, "success");
      navigate("/");
    } catch (error: any) {
      if (error.message) addToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <InputLayout
        label="Full Name"
        errMessage={errors.name && errors.name.message}
      >
        <input
          type="text"
          disabled={isSubmitting}
          placeholder="John Doe"
          {...register("name")}
          className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
            errors.name
              ? "border-red-500 focus:ring-red-500/50"
              : "border-border focus:ring-primary/50"
          }`}
        />
      </InputLayout>
      <InputLayout
        label="Email"
        errMessage={errors.email && errors.email.message}
      >
        <input
          type="email"
          placeholder="you@example.com"
          disabled={isSubmitting}
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
          type="password"
          placeholder="••••••••"
          disabled={isSubmitting}
          {...register("password")}
          className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
            errors.password
              ? "border-red-500 focus:ring-red-500/50"
              : "border-border focus:ring-primary/50"
          }`}
        />
      </InputLayout>
      <InputLayout
        label="Confirm Password"
        errMessage={errors.confirmPassword && errors.confirmPassword.message}
      >
        <input
          type="password"
          placeholder="••••••••"
          disabled={isSubmitting}
          {...register("confirmPassword")}
          className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
            errors.confirmPassword
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
        {isSubmitting ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}

export default Register;
