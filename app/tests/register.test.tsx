import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Register from "~/routes/register";
import { useToast } from "~/context/toastProvider";
import { useNavigate } from "react-router";
import { authService } from "~/utils/authService";

vi.mock("~/context/toastProvider");
vi.mock("react-router", async () => ({
  ...(await vi.importActual("react-router")),
  useNavigate: vi.fn(),
}));
vi.mock("~/utils/authService");

describe("Register Component", () => {
  const mockAddToast = vi.fn();
  const mockNavigate = vi.fn();
  const mockRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as any).mockReturnValue({ addToast: mockAddToast });
    (useNavigate as any).mockReturnValue(mockNavigate);
    (authService.register as any) = mockRegister;
  });

  describe("Form Rendering", () => {
    it("should render all input fields", () => {
      render(<Register />);

      expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("you@example.com")
      ).toBeInTheDocument();
      expect(screen.getAllByPlaceholderText("••••••••")).toHaveLength(2);
    });

    it("should render all form labels", () => {
      render(<Register />);

      expect(screen.getByText("Full Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Password")).toBeInTheDocument();
      expect(screen.getByText("Confirm Password")).toBeInTheDocument();
    });

    it("should render register submit button", () => {
      render(<Register />);

      const submitButton = screen.getByRole("button", { name: /register/i });
      expect(submitButton).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should show name validation error for short name", async () => {
      const user = userEvent.setup();
      render(<Register />);

      const nameInput = screen.getByPlaceholderText("John Doe");
      await user.type(nameInput, "A");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText("Full name must be at least 2 characters")
        ).toBeInTheDocument();
      });
    });

    it("should show email validation error for invalid email", async () => {
      const user = userEvent.setup();
      render(<Register />);

      const emailInput = screen.getByPlaceholderText("you@example.com");
      await user.type(emailInput, "invalid-email");
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText("Invalid email address")).toBeInTheDocument();
      });
    });

    it("should show password validation error for short password", async () => {
      const user = userEvent.setup();
      render(<Register />);

      const passwordInputs = screen.getAllByPlaceholderText("••••••••");
      await user.type(passwordInputs[0], "123");
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText("Password must be at least 6 characters")
        ).toBeInTheDocument();
      });
    });

    it("should show error when passwords don't match", async () => {
      const user = userEvent.setup();
      render(<Register />);

      const nameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInputs = screen.getAllByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /register/i });

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(passwordInputs[0], "password123");
      await user.type(passwordInputs[1], "password456");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Passwords don't match")).toBeInTheDocument();
      });
    });

    it("should not show validation errors for valid inputs", async () => {
      const user = userEvent.setup();
      render(<Register />);

      const nameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInputs = screen.getAllByPlaceholderText("••••••••");

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(passwordInputs[0], "password123");
      await user.type(passwordInputs[1], "password123");

      expect(
        screen.queryByText("Full name must be at least 2 characters")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Invalid email address")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Password must be at least 6 characters")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Passwords don't match")
      ).not.toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("should call register service with correct data on submit", async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValue({ message: "Registration successful" });

      render(<Register />);

      const nameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInputs = screen.getAllByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /register/i });

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(passwordInputs[0], "password123");
      await user.type(passwordInputs[1], "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
          confirmPassword: "password123",
        });
      });
    });

    it("should show success toast and navigate on successful registration", async () => {
      const user = userEvent.setup();
      mockRegister.mockResolvedValue({ message: "Registration successful" });

      render(<Register />);

      const nameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInputs = screen.getAllByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /register/i });

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(passwordInputs[0], "password123");
      await user.type(passwordInputs[1], "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAddToast).toHaveBeenCalledWith(
          "Registration successful",
          "success"
        );
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    it("should show error toast on failed registration", async () => {
      const user = userEvent.setup();
      mockRegister.mockRejectedValue(new Error("Email already exists"));

      render(<Register />);

      const nameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInputs = screen.getAllByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /register/i });

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(passwordInputs[0], "password123");
      await user.type(passwordInputs[1], "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAddToast).toHaveBeenCalledWith(
          "Email already exists",
          "error"
        );
      });
    });

    it("should disable inputs while submitting", async () => {
      const user = userEvent.setup();
      mockRegister.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<Register />);

      const nameInput = screen.getByPlaceholderText(
        "John Doe"
      ) as HTMLInputElement;
      const emailInput = screen.getByPlaceholderText(
        "you@example.com"
      ) as HTMLInputElement;
      const passwordInputs = screen.getAllByPlaceholderText(
        "••••••••"
      ) as HTMLInputElement[];
      const submitButton = screen.getByRole("button", {
        name: /register/i,
      }) as HTMLButtonElement;

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(passwordInputs[0], "password123");
      await user.type(passwordInputs[1], "password123");
      await user.click(submitButton);

      expect(nameInput.disabled).toBe(true);
      expect(emailInput.disabled).toBe(true);
      expect(passwordInputs[0].disabled).toBe(true);
      expect(passwordInputs[1].disabled).toBe(true);
      expect(submitButton.disabled).toBe(true);
    });

    it("should show loading text on submit button while submitting", async () => {
      const user = userEvent.setup();
      mockRegister.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<Register />);

      const nameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInputs = screen.getAllByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /register/i });

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(passwordInputs[0], "password123");
      await user.type(passwordInputs[1], "password123");
      await user.click(submitButton);

      expect(screen.getByText("Registering...")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should not submit form with empty fields", async () => {
      const user = userEvent.setup();
      render(<Register />);

      const submitButton = screen.getByRole("button", { name: /register/i });
      await user.click(submitButton);

      expect(mockRegister).not.toHaveBeenCalled();
    });

    it("should handle registration errors with no message gracefully", async () => {
      const user = userEvent.setup();
      mockRegister.mockRejectedValue(new Error());

      render(<Register />);

      const nameInput = screen.getByPlaceholderText("John Doe");
      const emailInput = screen.getByPlaceholderText("you@example.com");
      const passwordInputs = screen.getAllByPlaceholderText("••••••••");
      const submitButton = screen.getByRole("button", { name: /register/i });

      await user.type(nameInput, "John Doe");
      await user.type(emailInput, "john@example.com");
      await user.type(passwordInputs[0], "password123");
      await user.type(passwordInputs[1], "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockAddToast).toHaveBeenCalled();
      });
    });

    it("should validate email format strictly", async () => {
      const user = userEvent.setup();
      render(<Register />);

      const emailInput = screen.getByPlaceholderText("you@example.com");

      const testEmails = [
        "test@",
        "@example.com",
        "test@.com",
        "test..@example.com",
      ];

      for (const email of testEmails) {
        await user.clear(emailInput);
        await user.type(emailInput, email);
        await user.tab();

        await waitFor(() => {
          expect(screen.getByText("Invalid email address")).toBeInTheDocument();
        });
      }
    });
  });
});
