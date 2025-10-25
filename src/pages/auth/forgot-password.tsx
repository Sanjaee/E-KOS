// pages/auth/forgot-password.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import Link from "next/link";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type EmailForm = z.infer<typeof emailSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const validatedData = emailSchema.parse({ email });

      const response = await fetch("/api/auth/forgot-password/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      if (data.success === true) {
        toast({
          title: "Success",
          description: "Check your email for the reset code.",
          variant: "default",
        });
        // Store email in session storage for persistence
        sessionStorage.setItem("reset_password_email", email);
        router.push(
          `/auth/verify-reset-password?email=${encodeURIComponent(email)}`
        );
      } else {
        throw new Error(data.message);
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
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-44 bg-gray-50 dark:bg-gray-900 flex flex-col justify-center sm:px-6 lg:px-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
          <Mail className="w-6 h-6 text-blue-600 dark:text-blue-300" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter your email address and we'll send you a code to reset your
          password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 
                         rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 
                         focus:outline-none focus:ring-blue-500 dark:focus:ring-blue-400 
                         focus:border-blue-500 dark:focus:border-blue-400 bg-gray-50 
                         dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                       shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                       dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 
                       focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 
                       dark:disabled:bg-blue-700 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send reset code"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 
                     dark:text-blue-400 dark:hover:text-blue-300"
            >
              Return to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
