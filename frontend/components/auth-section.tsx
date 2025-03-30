"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Types and Interfaces
interface AuthSectionProps {
  forEmployers?: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  dob?: string;
}

interface SignInFormData {
  email: string;
  password: string;
}

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  dob?: string;
  companyname?: string;
}

// Environment check
const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("API URL:", API_URL);

if (!API_URL) {
  throw new Error("API_URL is not defined - check your environment variables");
}

// Custom hook for form handling
const useAuthForm = (isSignUp: boolean) => {
  const [formData, setFormData] = useState<SignInFormData | SignUpFormData>(
    isSignUp
      ? ({
          email: "",
          password: "",
          name: "",
          dob: "",
        } as SignUpFormData)
      : ({
          email: "",
          password: "",
        } as SignInFormData)
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const setError = (field: string, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
    setShowErrors(true);
    setTimeout(() => setShowErrors(false), 5000);
  };

  return {
    formData,
    errors,
    showErrors,
    isLoading,
    setField,
    setError,
    setIsLoading,
    setShowErrors,
  };
};

// Form validation functions
const validateSignInForm = (data: SignInFormData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Please enter a valid email";
  }

  if (!data.password) {
    errors.password = "Password is required";
  }

  return errors;
};

const validateSignUpForm = (
  data: SignUpFormData,
  forEmployers: boolean
): FormErrors => {
  const errors: FormErrors = {};

  if (!data.name) {
    errors.name = "Name is required";
  }

  if (!data.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Please enter a valid email";
  }

  if (!forEmployers) {
    if (!data.dob) {
      errors.dob = "Date of birth is required";
    } else {
      const dobDate = new Date(data.dob);
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

      if (dobDate > eighteenYearsAgo) {
        errors.dob = "You must be at least 18 years old";
      }
    }
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return errors;
};

export function AuthSection({ forEmployers = false }: AuthSectionProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUp, setShowSignUp] = useState(true);

  // Form state management
  const signInForm = useAuthForm(false);
  const signUpForm = useAuthForm(true);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = signInForm.formData as SignInFormData;
    const errors = validateSignInForm(data);

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, message]) => {
        signInForm.setError(field, message);
      });
      return;
    }

    signInForm.setIsLoading(true);

    try {
      const endpoint = forEmployers ? "hire/signin" : "user/signin";
      const response = await fetch(`${API_URL}/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to sign in");
      }

      localStorage.setItem("token", responseData.token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userType", forEmployers ? "employer" : "user");

      router.push(forEmployers ? "/hire/dashboard" : "/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message;
        if (message.includes("email")) {
          signInForm.setError("email", message);
        } else if (message.includes("password")) {
          signInForm.setError("password", message);
        }
      }
    } finally {
      signInForm.setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = signUpForm.formData as SignUpFormData;
    const errors = validateSignUpForm(data, forEmployers);

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, message]) => {
        signUpForm.setError(field, message);
      });
      return;
    }

    signUpForm.setIsLoading(true);

    try {
      const endpoint = forEmployers ? "hire/signup" : "user/signup";

      // Create the correct payload format based on user type
      const payload = forEmployers
        ? {
            email: data.email,
            password: data.password,
            companyname: data.name, // Use the name field as companyname for employers
          }
        : {
            email: data.email,
            password: data.password,
            name: data.name,
            dob: data.dob,
          };

      const response = await fetch(`${API_URL}/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to sign up");
      }

      localStorage.setItem("token", responseData.token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userType", forEmployers ? "employer" : "user");

      router.push(forEmployers ? "/hire/dashboard" : "/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message;
        if (message.includes("email")) {
          signUpForm.setError("email", message);
        } else if (message.includes("password")) {
          signUpForm.setError("password", message);
        } else if (message.includes("name")) {
          signUpForm.setError("name", message);
        } else {
          signUpForm.setError("email", message);
        }
      }
    } finally {
      signUpForm.setIsLoading(false);
    }
  };

  // Fix for date picker focus issue
  const handleDateFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    try {
      e.currentTarget.showPicker();
    } catch (error) {
      console.log("Date picker not supported in this browser +", error);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-2 rounded-xl border bg-card p-6 shadow-lg relative h-[580px]">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-200 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 rounded-full filter blur-3xl opacity-20"></div>

      {/* Sign In Section */}
      <div
        className={cn(
          "space-y-2.5 transition-all duration-500 absolute inset-0 p-6",
          showSignUp
            ? "opacity-0 -translate-y-4 pointer-events-none"
            : "opacity-100 translate-y-0 pointer-events-auto"
        )}
      >
        <div className="text-center mb-3">
          <h3 className="text-2xl font-bold">Sign In</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {forEmployers
              ? "Access your employer account"
              : "Access your KodJobs account"}
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-2.5">
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="email-signin"
                type="email"
                placeholder="Email address"
                className={cn(
                  "h-11",
                  signInForm.errors.email &&
                    "border-red-500 focus-visible:ring-red-500"
                )}
                value={signInForm.formData.email}
                onChange={(e) => signInForm.setField("email", e.target.value)}
              />
              {signInForm.errors.email && (
                <div
                  className={cn(
                    "text-xs text-red-500 mt-1 flex items-center gap-1",
                    signInForm.showErrors ? "animate-shake" : ""
                  )}
                >
                  <AlertCircle className="h-3 w-3" />
                  {signInForm.errors.email}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="password-signin"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={cn(
                  "h-11",
                  signInForm.errors.password &&
                    "border-red-500 focus-visible:ring-red-500"
                )}
                value={signInForm.formData.password}
                onChange={(e) =>
                  signInForm.setField("password", e.target.value)
                }
              />
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
              {signInForm.errors.password && (
                <div
                  className={cn(
                    "text-xs text-red-500 mt-1 flex items-center gap-1",
                    signInForm.showErrors ? "animate-shake" : ""
                  )}
                >
                  <AlertCircle className="h-3 w-3" />
                  {signInForm.errors.password}
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <Button variant="link" className="px-0 h-auto text-xs" size="sm">
                Forgot password?
              </Button>
            </div>
          </div>
          <Button
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black relative overflow-hidden group h-11"
            type="submit"
            disabled={signInForm.isLoading}
          >
            {signInForm.isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Signing In...
              </>
            ) : (
              <>
                <span className="relative z-10 group-hover:text-black">
                  Sign In
                </span>
                <span className="absolute inset-0 bg-yellow-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              </>
            )}
          </Button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative bg-card px-4 text-sm text-muted-foreground">
            {forEmployers ? "New employer?" : "New to KodJobs?"}
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full h-11"
          onClick={() => setShowSignUp(true)}
        >
          Create an Account
        </Button>
      </div>

      {/* Sign Up Section */}
      <div
        className={cn(
          "space-y-2.5 transition-all duration-500 absolute inset-0 p-6",
          !showSignUp
            ? "opacity-0 translate-y-4 pointer-events-none"
            : "opacity-100 translate-y-0 pointer-events-auto"
        )}
      >
        <div className="text-center mb-3">
          <h3 className="text-2xl font-bold">Create Account</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {forEmployers
              ? "Join KodJobs to find top talent"
              : "Join KodJobs to find your dream job"}
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-2.5">
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="name"
                placeholder={forEmployers ? "Company name" : "Full name"}
                className={cn(
                  "h-11",
                  signUpForm.errors.name &&
                    "border-red-500 focus-visible:ring-red-500"
                )}
                value={(signUpForm.formData as SignUpFormData).name}
                onChange={(e) => signUpForm.setField("name", e.target.value)}
              />
              {signUpForm.errors.name && (
                <div
                  className={cn(
                    "text-xs text-red-500 mt-1 flex items-center gap-1",
                    signUpForm.showErrors ? "animate-shake" : ""
                  )}
                >
                  <AlertCircle className="h-3 w-3" />
                  {signUpForm.errors.name}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="email-signup"
                type="email"
                placeholder="Email"
                className={cn(
                  "h-11",
                  signUpForm.errors.email &&
                    "border-red-500 focus-visible:ring-red-500"
                )}
                value={signUpForm.formData.email}
                onChange={(e) => signUpForm.setField("email", e.target.value)}
              />
              {signUpForm.errors.email && (
                <div
                  className={cn(
                    "text-xs text-red-500 mt-1 flex items-center gap-1",
                    signUpForm.showErrors ? "animate-shake" : ""
                  )}
                >
                  <AlertCircle className="h-3 w-3" />
                  {signUpForm.errors.email}
                </div>
              )}
            </div>
          </div>
          {!forEmployers && (
            <div className="space-y-2">
              <div className="relative">
                <div className="relative">
                  <Input
                    id="dob-signup"
                    type="date"
                    className={cn(
                      "h-11 w-full",
                      signUpForm.errors.dob &&
                        "border-red-500 focus-visible:ring-red-500",
                      !(signUpForm.formData as SignUpFormData).dob &&
                        "text-transparent"
                    )}
                    onFocus={handleDateFocus}
                    value={(signUpForm.formData as SignUpFormData).dob}
                    onChange={(e) => signUpForm.setField("dob", e.target.value)}
                    required
                  />
                  {!(signUpForm.formData as SignUpFormData).dob && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                      Date of Birth
                    </div>
                  )}
                </div>
                {signUpForm.errors.dob && (
                  <div
                    className={cn(
                      "text-xs text-red-500 mt-1 flex items-center gap-1",
                      signUpForm.showErrors ? "animate-shake" : ""
                    )}
                  >
                    <AlertCircle className="h-3 w-3" />
                    {signUpForm.errors.dob}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="password-signup"
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                className={cn(
                  "h-11",
                  signUpForm.errors.password &&
                    "border-red-500 focus-visible:ring-red-500"
                )}
                value={signUpForm.formData.password}
                onChange={(e) =>
                  signUpForm.setField("password", e.target.value)
                }
              />
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
              {signUpForm.errors.password && (
                <div
                  className={cn(
                    "text-xs text-red-500 mt-1 flex items-center gap-1",
                    signUpForm.showErrors ? "animate-shake" : ""
                  )}
                >
                  <AlertCircle className="h-3 w-3" />
                  {signUpForm.errors.password}
                </div>
              )}
            </div>
          </div>
          <Button
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black relative overflow-hidden group h-11"
            type="submit"
            disabled={signUpForm.isLoading}
          >
            {signUpForm.isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating Account...
              </>
            ) : (
              <>
                <span className="relative z-10 group-hover:text-black">
                  Create Account
                </span>
                <span className="absolute inset-0 bg-yellow-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              </>
            )}
          </Button>
          <p className="text-[11px] text-center text-muted-foreground">
            By signing up, you agree to our{" "}
            <Button variant="link" className="h-auto p-0 text-[11px]" size="sm">
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button variant="link" className="h-auto p-0 text-[11px]" size="sm">
              Privacy Policy
            </Button>
          </p>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative bg-card px-4 text-sm text-muted-foreground">
            Already have an account?
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full h-11"
          onClick={() => setShowSignUp(false)}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
}
