import { ArrowLeft, Mail, Lock, Eye, EyeOff, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import LoadingOverlay from "@/components/LoadingOverlay";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { callbackUrl, error, from } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleWindowRef = useRef<Window | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  // Store referrer in session storage when the component mounts
  useEffect(() => {
    if (
      !callbackUrl &&
      !from &&
      document.referrer &&
      !document.referrer.includes("/auth/")
    ) {
      sessionStorage.setItem("loginReferrer", document.referrer);
    }
  }, [callbackUrl, from]);

  useEffect(() => {
    // Redirect if authenticated and not loading
    if (status === "authenticated" && !isLoading && !googleLoading) {
      const storedReferrer = sessionStorage.getItem("loginReferrer");
      const redirectUrl =
        callbackUrl?.toString() ||
        from?.toString() ||
        (storedReferrer && !storedReferrer.includes("/auth/")
          ? storedReferrer
          : "/");

      router.replace(redirectUrl);
      sessionStorage.removeItem("loginReferrer");
      setShowGoogleModal(false);
    }
  }, [status, router, callbackUrl, from, isLoading, googleLoading]);

  useEffect(() => {
    if (error === "EMAIL_NOT_VERIFIED") {
      toast({
        title: "Email not verified",
        description: "Please verify your email before logging in.",
        variant: "destructive",
      });
      router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}`);
    }
  }, [error, router, formData.email]);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const validatedData = loginSchema.parse(formData);

      const storedReferrer = sessionStorage.getItem("loginReferrer");
      const redirectUrl =
        callbackUrl?.toString() ||
        from?.toString() ||
        (storedReferrer && !storedReferrer.includes("/auth/")
          ? storedReferrer
          : "/");

      const result = await signIn("credentials", {
        email: validatedData.email,
        password: validatedData.password,
        redirect: false,
        callbackUrl: redirectUrl,
      });

      if (result?.error) {
        if (result.error === "EMAIL_NOT_VERIFIED") {
          router.push(
            `/auth/verify?email=${encodeURIComponent(formData.email)}`
          );
          toast({
            title: "Email not verified",
            description: "Please verify your email before logging in.",
            variant: "destructive",
          });
        } else {
          throw new Error(result.error);
        }
      } else if (result?.ok) {
        sessionStorage.removeItem("loginReferrer");
        router.replace(result.url || redirectUrl || "/");
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
          title: "Login error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login error",
          description: "An error occurred during login.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign In dengan Popup Modal
  const handleGoogleSignIn = async () => {
    try {
      setShowGoogleModal(true);
      setGoogleLoading(true);
  
      const storedReferrer = sessionStorage.getItem("loginReferrer");
      const redirectUrl =
        callbackUrl?.toString() ||
        from?.toString() ||
        (storedReferrer && !storedReferrer.includes("/auth/")
          ? storedReferrer
          : "/");
      
      // ✅ Buka popup SINKRON dan kosong dulu supaya gesture klik tetap aktif
      googleWindowRef.current = window.open(
        "about:blank",
        `google-signin-${Date.now()}`,
        `width=500,height=600,left=${window.innerWidth / 2 - 250},top=${window.innerHeight / 2 - 300},resizable=yes,scrollbars=yes,popup=yes`
      );

      if (!googleWindowRef.current) {
        toast({
          title: "Popup Blocked",
          description: "Please disable popup blocker and try again.",
          variant: "destructive",
        });
        setGoogleLoading(false);
        setShowGoogleModal(false);
        return;
      }

      // ✅ Minta URL Google ke NextAuth TANPA redirect agar cookies (state/PKCE) diset benar
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: redirectUrl,
      });

      if (result?.error) {
        toast({
          title: "Login error",
          description: result.error,
          variant: "destructive",
        });
        setGoogleLoading(false);
        if (googleWindowRef.current) googleWindowRef.current.close();
        return;
      }

      if (!result?.url) {
        toast({
          title: "Login error",
          description: "Failed to start Google login.",
          variant: "destructive",
        });
        setGoogleLoading(false);
        if (googleWindowRef.current) googleWindowRef.current.close();
        return;
      }

      // ✅ Arahkan popup ke halaman Google (tetap di popup, bukan window utama)
      googleWindowRef.current.location.href = result.url;

      // ✅ Poll session tiap detik saat popup ditutup
      pollIntervalRef.current = setInterval(async () => {
        if (googleWindowRef.current?.closed) {
          clearInterval(pollIntervalRef.current!);

          const res = await fetch("/api/auth/session");
          const sessionData = await res.json();

          if (sessionData?.user) {
            toast({ title: "Login successful", variant: "default" });
            sessionStorage.removeItem("loginReferrer");
            router.replace(redirectUrl || "/");
          } else {
            toast({ title: "Login cancelled", variant: "destructive" });
          }

          setGoogleLoading(false);
          setShowGoogleModal(false);
        }
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login error",
        description: "An error occurred during Google login.",
        variant: "destructive",
      });
      setGoogleLoading(false);
      setShowGoogleModal(false);
      if (googleWindowRef.current) googleWindowRef.current.close();
    }
  };
  

  const closeGoogleModal = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    if (googleWindowRef.current) {
      googleWindowRef.current.close();
    }
    setShowGoogleModal(false);
    setGoogleLoading(false);
  };

  useEffect(() => {
    const errorMessage = router.query.error;
    if (errorMessage && typeof errorMessage === "string") {
      const { error, ...restQuery } = router.query;
      router.replace(
        {
          pathname: router.pathname,
          query: restQuery,
        },
        undefined,
        { shallow: true }
      );
    }
  }, [router.query.error]);

  const handleBack = () => {
    if (from === "home") {
      router.push("/");
      return;
    }

    const referrer = document.referrer;

    if (referrer.includes("/auth/")) {
      router.push("/");
    } else {
      router.back();
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingOverlay isLoading={true} />
      </div>
    );
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-44 flex items-center justify-center bg-gray-50 dark:bg-gray-900 relative">
      <LoadingOverlay isLoading={isLoading} />
      
      <button
        onClick={handleBack}
        disabled={isLoading}
        className="absolute top-10 left-4 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 flex items-center gap-2 md:mt-20 md:ml-20"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Login to access many features on zacode
            </h1>
            <p className="mt-3 text-gray-600 dark:text-gray-300">
              Login with your email or continue with Google
            </p>
          </div>

          <form onSubmit={handleCredentialsLogin} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 
                           rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                />
              </div>
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
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 
                           rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  href="/auth/register"
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Don't have an account?
                </Link>
              </div>
              <div className="text-sm">
                <Link
                  href="/auth/forgot-password"
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || googleLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                       shadow-sm text-sm font-medium text-white bg-blue-600 
                       ${
                         isLoading || googleLoading
                           ? "opacity-50 cursor-not-allowed"
                           : "hover:bg-blue-700"
                       } 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Sign in with Email"
              )}
            </button>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading || googleLoading}
              type="button"
              className={`w-full flex items-center justify-center gap-3 px-4 py-3 border 
                       border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
                       bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 
                       ${
                         isLoading || googleLoading
                           ? "opacity-50 cursor-not-allowed"
                           : "hover:bg-gray-50 dark:hover:bg-gray-600"
                       } 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                       transition-all duration-200`}
            >
              {googleLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                <>
                  <Image
                    src="/google.png"
                    alt="Google"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                  <span className="text-base font-medium">
                    Continue with Google
                  </span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              By continuing, you agree to our{" "}
              <Link
                href="/terms"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}