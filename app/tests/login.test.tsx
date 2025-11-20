import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../routes/login";
import { useAuth } from "../context/authProvider";
import { useToast } from "../context/toastProvider";
import { useNavigate } from "react-router";

// Mock dependencies
vi.mock("~/context/authProvider");
vi.mock("~/context/toastProvider");
vi.mock("react-router", async () => ({
  ...(await vi.importActual("react-router")),
  useNavigate: vi.fn(),
}));

describe("Login Component", () => {
  const mockLogin = vi.fn();
  const mockAddToast = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({ login: mockLogin });
    (useToast as any).mockReturnValue({ addToast: mockAddToast });
    (useNavigate as any).mockReturnValue(mockNavigate);
  });

  describe("Form Rendering", () => {
    it("should render email and password input fields", () => {
      render(<Login />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it("should render login button", () => {
      render(<Login />);

      const submitButton = screen.getByRole("button", { name: /login/i });
      expect(submitButton).toBeInTheDocument();
    });

    it("should have email and password labels", () => {
      render(<Login />);

      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Password")).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should show email validation error for invalid email", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const emailInput = screen.getByPlaceholderText("you@example.com");

      await user.type(emailInput, "invalid-email");
      await user.tab(); // Trigger blur for validation

      await waitFor(() => {
        expect(screen.getByText("Invalid email address")).toBeInTheDocument();
      });
    });

    it("should show password validation error for short password", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const passwordInput = screen.getByPlaceholderText("••••••••");

      await user.type(passwordInput, "123");
      await user.tab(); // Trigger blur for validation

      await waitFor(() => {
        expect(
          screen.getByText("Password must be at least 6 characters")
        ).toBeInTheDocument();
      });
    });

    it("should not show validation errors for valid inputs", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "validpassword123");

      // No validation errors should be present
      expect(
        screen.queryByText("Invalid email address")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Password must be at least 6 characters")
      ).not.toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("should call login function with correct credentials on submit", async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue("Login successful");

      render(<Login />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /login/i });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith(
          "test@example.com",
          "password123"
        );
      });
    });

    it("should show success toast and navigate on successful login", async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue("Login successful");

      render(<Login />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /login/i });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAddToast).toHaveBeenCalledWith(
          "Login successful",
          "success"
        );
        expect(mockNavigate).toHaveBeenCalledWith("/profile");
      });
    });

    it("should show error toast on failed login", async () => {
      const user = userEvent.setup();
      mockLogin.mockRejectedValue(new Error("Invalid credentials"));

      render(<Login />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /login/i });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAddToast).toHaveBeenCalledWith(
          "Invalid credentials",
          "error"
        );
      });
    });

    it("should disable inputs while submitting", async () => {
      const user = userEvent.setup();
      mockLogin.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<Login />);

      const emailInput = screen.getByPlaceholderText(
        "you@example.com"
      ) as HTMLInputElement;
      const passwordInput = screen.getByPlaceholderText(
        "••••••••"
      ) as HTMLInputElement;
      const submitButton = screen.getByRole("button", {
        name: /login/i,
      }) as HTMLButtonElement;

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      expect(emailInput.disabled).toBe(true);
      expect(passwordInput.disabled).toBe(true);
      expect(submitButton.disabled).toBe(true);
    });

    it("should show loading text on submit button while submitting", async () => {
      const user = userEvent.setup();
      mockLogin.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<Login />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /login/i });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      expect(screen.getByText("Logging In...")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should not submit form with empty fields", async () => {
      const user = userEvent.setup();
      render(<Login />);

      const submitButton = screen.getByRole("button", { name: /login/i });
      await user.click(submitButton);

      expect(mockLogin).not.toHaveBeenCalled();
    });

    it("should handle network errors gracefully", async () => {
      const user = userEvent.setup();
      mockLogin.mockRejectedValue(new Error("Network error"));

      render(<Login />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInput = screen.getByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /login/i });

      await user.type(emailInput, "test@example.com");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAddToast).toHaveBeenCalledWith("Network error", "error");
      });
    });
  });
});
