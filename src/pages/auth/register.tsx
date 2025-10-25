import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, User, Lock, Check, X } from "lucide-react";
import Link from "next/link";

const registerSchema = z.object({
  name: z.string().min(2, "Nama harus minimal 2 karakter"),
  email: z.string().email("Alamat email tidak valid"),
  password: z
    .string()
    .min(8, "Kata sandi harus terdiri dari minimal 8 karakter")
    .regex(/[A-Z]/, "Kata sandi harus mengandung minimal satu huruf kapital")
    .regex(/[a-z]/, "Kata sandi harus mengandung minimal satu huruf kecil")
    .regex(/[0-9]/, "Kata sandi harus mengandung minimal satu angka")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Kata sandi harus mengandung minimal satu karakter spesial"
    ),
});

type RegisterForm = z.infer<typeof registerSchema>;

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

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string>("");

  const validateEmail = (email: string) => {
    const blockedDomains = [
      "tempmail.com",
      "temp-mail.org",
      "yopmail.com",
      "mailinator.com",
    ];
    const domain = email.split("@")[1];

    if (!email) return "";
    if (!email.includes("@")) return "Format email tidak valid";
    if (domain && blockedDomains.includes(domain)) {
      return "Gunakan email aktif, jangan gunakan email sementara";
    }
    return "";
  };
  // Password validation states
  const [validations, setValidations] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // Update password validations
  useEffect(() => {
    const { password } = formData;
    setValidations({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const validatedData = registerSchema.parse(formData);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      switch (data.status) {
        case "UNVERIFIED_EMAIL":
        case "SUCCESS":
          toast({
            title: "Success",
            description: "Akun berhasil dibuat. Silakan verifikasi email Anda.",
            variant: "default",
          });
          sessionStorage.setItem("verification_email", data.email);
          router.push(`/auth/verify?email=${encodeURIComponent(data.email)}`);
          break;
        default:
          throw new Error("Unknown response status");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
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
    if (passwordStrength === 5) return "bg-green-500";
    if (passwordStrength >= 3) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen pt-10 pb-44 bg-gray-50 dark:bg-gray-900 flex flex-col justify-center sm:px-6 lg:px-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  id="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => {
                    const newEmail = e.target.value;
                    setFormData({ ...formData, email: newEmail });
                    setEmailError(validateEmail(newEmail));
                  }}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    emailError
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none`}
                  placeholder="you@example.com"
                />
              </div>
              {emailError ? (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {emailError}
                </p>
              ) : (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Masukkan email aktif untuk verifikasi OTP
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={`block w-full pl-10 pr-10 py-2 border ${
                    passwordStrength < 5
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  } rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none`}
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

              {/* Password strength indicator */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Password strength:
                  </span>
                  <span className="text-sm font-medium">
                    {passwordStrength === 5
                      ? "Gasss Register 🔥"
                      : passwordStrength >= 3
                      ? "Hampir Selesai!"
                      : "Belum Lengkap"}
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getStrengthColor()} transition-all duration-300`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
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
                  text="Mengandung satu huruf Kapital"
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
                  text="Mengandung Karakter Spesial (!&*(),.)"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || passwordStrength < 5}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 dark:disabled:bg-blue-700 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-10 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link
            href="/auth/login?from=home"
            className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
