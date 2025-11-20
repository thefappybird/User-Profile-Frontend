import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { User } from "~/utils/types/user";
import InputLayout from "../ui/input-layout";
import { userService } from "~/utils/userService";
import { useToast } from "~/context/toastProvider";
import { useAuth } from "~/context/authProvider";
import { Button } from "../ui/button";

const editProfileSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .or(z.literal("")),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      if (data.password) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  );

type EditProfileForm = z.infer<typeof editProfileSchema>;

interface EditProfileModalProps {
  onClose: () => void;
  user: User | null;
}

export function EditProfileModal({ onClose, user }: EditProfileModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();
  const { setUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // When `user` changes (or modal opens), update form values
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: "",
        confirmPassword: "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: EditProfileForm) => {
    setIsSubmitting(true);
    try {
      if (user) {
        const response = await userService.updateUser(user.id, data);
        setUser(response.currentUser);
        addToast(response.message, "success");
        onClose();
      }
    } catch (error: any) {
      if (error.message) {
        addToast(error.message, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-300">
        <div className="sticky top-0 bg-white border-b border-gray-300 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="text-gray-500 hover:text-black disabled:opacity-50"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <InputLayout
              label="Full Name"
              errMessage={errors.name && errors.name.message}
            >
              <input
                id="name"
                type="text"
                disabled={isSubmitting}
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
                {...register("name")}
              />
            </InputLayout>
            <InputLayout
              label="Email"
              errMessage={errors.email && errors.email.message}
            >
              <input
                id="email"
                type="email"
                disabled={isSubmitting}
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
                {...register("email")}
              />
            </InputLayout>
            <InputLayout
              label="New Password (optional)"
              errMessage={errors.password && errors.password.message}
            >
              <input
                id="password"
                type="password"
                disabled={isSubmitting}
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
                {...register("password")}
              />
            </InputLayout>

            <InputLayout
              label="Confirm Password"
              errMessage={
                errors.confirmPassword && errors.confirmPassword.message
              }
            >
              <input
                id="confirmPassword"
                type="password"
                disabled={isSubmitting}
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring focus:ring-blue-200"
                {...register("confirmPassword")}
              />
            </InputLayout>

            <div className="flex gap-3 pt-6">
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                className="flex-1 px-4 py-2 border bg-white border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </Button>

              <Button
                className=" flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
