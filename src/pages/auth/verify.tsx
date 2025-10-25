import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import LoadingOverlay from "@/components/LoadingOverlay";

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OtpForm = z.infer<typeof otpSchema>;

const STORAGE_KEY = "verification_email";

export default function VerifyPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(10);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    // Handle email persistence
    const handleEmailPersistence = () => {
      const queryEmail = router.query.email as string;
      const storedEmail = sessionStorage.getItem(STORAGE_KEY);

      if (queryEmail) {
        // If email is in query params, store it
        sessionStorage.setItem(STORAGE_KEY, queryEmail);
        setEmail(queryEmail);
      } else if (storedEmail) {
        // If email is in storage, use it
        setEmail(storedEmail);
      } else {
        // If no email is found, redirect to register
        router.push("/auth/register");
      }
    };

    handleEmailPersistence();
  }, [router.query.email]);

  // Cleanup storage on successful verification
  const cleanupStorage = () => {
    sessionStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0 && isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer, isResendDisabled]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value.replace(/[^0-9]/g, ""); // Only allow numbers
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) newOtp[i] = pastedData[i];
    }

    setOtp(newOtp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const otpString = otp.join("");
      const validatedOtp = otpSchema.parse({ otp: otpString });

      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otpCode: validatedOtp.otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast({
        title: "Success",
        description: "Email verified successfully!",
        variant: "default",
      });
      cleanupStorage(); // Clean up stored email
      router.push("/auth/login");
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

  const handleResendOtp = async () => {
    try {
      setIsResending(true); // Show loading overlay
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      toast({
        title: "Success",
        description: "OTP code resent successfully!",
        variant: "default",
      });
      setTimer(60);
      setIsResendDisabled(true);
      setOtp(["", "", "", "", "", ""]);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: "The server is busy, please try again later.",
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
      setIsResending(false); // Hide loading overlay
    }
  };

  // Early return while checking email
  if (!email) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-gray-600 dark:text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center pt-24 pb-44 sm:px-6 lg:px-8 px-4">
      {isResending && <LoadingOverlay isLoading={true} />}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
          <Mail className="w-6 h-6 text-blue-600 dark:text-blue-300" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          We've sent a verification code to
          <span className="font-medium text-blue-600 dark:text-blue-400">
            {" "}
            {email}
          </span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 rounded-lg px-4 shadow sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Verification Code
              </label>
              <div
                className="mt-2 flex gap-2 items-center justify-between"
                onPaste={handlePaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="block w-12 h-12 rounded-lg border-gray-300 dark:border-gray-600 shadow-sm 
                              focus:border-blue-500 dark:focus:border-blue-400 
                              focus:ring-blue-500 dark:focus:ring-blue-400 text-center text-lg 
                              bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || otp.join("").length !== 6}
                className="w-full flex justify-center py-2 px-4 border border-transparent 
                          rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 
                          hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                          focus:ring-blue-500 disabled:bg-blue-300 dark:disabled:bg-blue-700 
                          disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Verifying..." : "Verify Email"}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResendDisabled}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 
                          dark:hover:text-blue-300 disabled:text-gray-400 dark:disabled:text-gray-500 
                          disabled:cursor-not-allowed"
              >
                {isResendDisabled ? (
                  `Resend OTP in ${timer}s`
                ) : (
                  <span>
                    <span className="mr-1 dark:text-gray-400">
                      Tidak menerima email?
                    </span>
                    <span className="text-blue-600 dark:text-blue-400">
                      Kirim ulang
                    </span>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
