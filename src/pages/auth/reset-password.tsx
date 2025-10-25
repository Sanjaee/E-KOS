import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, Check, X } from "lucide-react";
import Link from "next/link";

const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
  <div className="flex items-center space-x-2">
    {met ? (
      <Check className="h-4 w-4 text-green-500" />
    ) : (
      <X className="h-4 w-4 text-gray-300" />
    )}
    <span
      className={`text-sm ${
        met
          ? "text-green-600 dark:text-green-400"
          : "text-gray-500 dark:text-gray-400"
      }`}
    >
      {text}
    </span>
  </div>
);

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function NewPasswordPage() {
  const router = useRouter();
  const { email, token } = router.query;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password validation states
  const [validations, setValidations] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    passwordsMatch: false,
  });

  // Update password validations
  useEffect(() => {
    setValidations({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      passwordsMatch: password === confirmPassword && password.length > 0,
    });
  }, [password, confirmPassword]);

  useEffect(() => {
    if (!email || !token) {
      router.push("/auth/forgot-password");
    }
  }, [email, token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const validatedData = passwordSchema.parse({
        password,
        confirmPassword,
      });

      const response = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otpCode: token,
          newPassword: validatedData.password,
        }),
      });

      const data = await response.json();
      toast({
        title: "Success",
        description: "Password reset successfully!",
        variant: "default",
      });
      if (!response.ok) {
        throw new Error(data.message);
      }
      router.push("/auth/login");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else if (error instanceof Error) {
        toast({
          title: "Error",
          description: "The server is busy, please try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "The server is busy, please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate overall password strength
  const passwordStrength = Object.values(validations).filter(Boolean).length;
  const getStrengthColor = () => {
    if (passwordStrength === 6) return "bg-green-500";
    if (passwordStrength >= 3) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen pt-24 pb-44 bg-gray-50 dark:bg-gray-900 flex flex-col justify-center sm:px-6 lg:px-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Create new password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Please enter your new password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                New Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                  focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="XXXXXX"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  )}
                </button>
              </div>

              <div className="my-5">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm New Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`block w-full pl-10 pr-10 py-2 border ${
                      passwordStrength < 6
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none`}
                    placeholder="XXXXXX"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password strength indicator */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Password strength:
                  </span>
                  <span className="text-sm font-medium">
                    {passwordStrength === 6
                      ? "Jangan Lupa Lagi!"
                      : passwordStrength >= 3
                      ? "Hampir selesai! 🚀"
                      : "Rules harus terpenuhi!"}
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStrengthColor()} transition-all duration-300`}
                    style={{ width: `${(passwordStrength / 6) * 100}%` }}
                  />
                </div>
              </div>

              {/* Password requirements checklist */}
              <div className="mt-4 space-y-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Password requirements:
                </h4>
                <PasswordRequirement
                  met={validations.minLength}
                  text="Minimal panjang 8 karakter"
                />
                <PasswordRequirement
                  met={validations.hasUpperCase}
                  text="Mengandung  satu huruf Kapital"
                />
                <PasswordRequirement
                  met={validations.hasLowerCase}
                  text="Mengandung satu huruf Kecil"
                />
                <PasswordRequirement
                  met={validations.hasNumber}
                  text="Mengandung minimal satu Angka"
                />
                <PasswordRequirement
                  met={validations.hasSpecialChar}
                  text="Mengandung karakter spesial (!@#$*(),.)"
                />
                <PasswordRequirement
                  met={validations.passwordsMatch}
                  text="Password dan konfirmasi password sama"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || passwordStrength < 6}
                className="w-full flex justify-center py-2 px-4 border border-transparent 
                rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Setting new password..." : "Set new password"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/login?from=home"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
            >
              Return to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
