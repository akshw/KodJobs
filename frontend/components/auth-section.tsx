"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface AuthSectionProps {
  forEmployers?: boolean;
}

export function AuthSection({ forEmployers = false }: AuthSectionProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showSignUp, setShowSignUp] = useState(true); // Default to sign up view

  // Form values
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpDob, setSignUpDob] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  // Form errors
  const [signInEmailError, setSignInEmailError] = useState("");
  const [signInPasswordError, setSignInPasswordError] = useState("");
  const [signUpNameError, setSignUpNameError] = useState("");
  const [signUpEmailError, setSignUpEmailError] = useState("");
  const [signUpDobError, setSignUpDobError] = useState("");
  const [signUpPasswordError, setSignUpPasswordError] = useState("");

  // Animation states for error messages
  const [showSignInErrors, setShowSignInErrors] = useState(false);
  const [showSignUpErrors, setShowSignUpErrors] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateSignInForm = () => {
    let isValid = true;

    // Reset errors
    setSignInEmailError("");
    setSignInPasswordError("");

    // Validate email
    if (!signInEmail) {
      setSignInEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(signInEmail)) {
      setSignInEmailError("Please enter a valid email");
      isValid = false;
    }

    // Validate password
    if (!signInPassword) {
      setSignInPasswordError("Password is required");
      isValid = false;
    }

    if (!isValid) {
      setShowSignInErrors(true);
      setTimeout(() => setShowSignInErrors(false), 5000);
    }

    return isValid;
  };

  const validateSignUpForm = () => {
    let isValid = true;

    // Reset errors
    setSignUpNameError("");
    setSignUpEmailError("");
    setSignUpDobError("");
    setSignUpPasswordError("");

    // Validate name
    if (!signUpName) {
      setSignUpNameError("Name is required");
      isValid = false;
    }

    // Validate email
    if (!signUpEmail) {
      setSignUpEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(signUpEmail)) {
      setSignUpEmailError("Please enter a valid email");
      isValid = false;
    }

    // Validate DOB
    if (!signUpDob) {
      setSignUpDobError("Date of birth is required");
      isValid = false;
    } else {
      // Check if user is at least 18 years old
      const dobDate = new Date(signUpDob);
      const today = new Date();
      const eighteenYearsAgo = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );

      if (dobDate > eighteenYearsAgo) {
        setSignUpDobError("You must be at least 18 years old");
        isValid = false;
      }
    }

    // Validate password
    if (!signUpPassword) {
      setSignUpPasswordError("Password is required");
      isValid = false;
    } else if (signUpPassword.length < 8) {
      setSignUpPasswordError("Password must be at least 8 characters");
      isValid = false;
    }

    if (!isValid) {
      setShowSignUpErrors(true);
      setTimeout(() => setShowSignUpErrors(false), 5000);
    }

    return isValid;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSignInForm()) return;

    setIsSigningIn(true);

    try {
      const response = await fetch("http://localhost:4000/api/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signInEmail, // FIXED: Using signin email
          password: signInPassword, // FIXED: Using signin password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to sign in");
      }

      // Store auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");

      // Navigate to dashboard
      router.push(forEmployers ? "/hire/dashboard" : "/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message;
        if (message.includes("email")) {
          setSignInEmailError(message);
        } else if (message.includes("password")) {
          setSignInPasswordError(message);
        }
        setShowSignInErrors(true);
        setTimeout(() => setShowSignInErrors(false), 5000);
      }
    } finally {
      setIsSigningIn(false); // FIXED: Using correct state setter
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSignUpForm()) return;

    setIsSigningUp(true);

    try {
      const response = await fetch("http://localhost:4000/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signUpEmail,
          password: signUpPassword,
          name: signUpName,
          dob: signUpDob,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to sign up");
      }

      // Store auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");

      // Navigate to dashboard (preserving existing logic)
      router.push(forEmployers ? "/hire/dashboard" : "/dashboard");
    } catch (error) {
      // Handle validation errors
      if (error instanceof Error) {
        const message = error.message;

        if (message.includes("email")) {
          setSignUpEmailError(message);
        } else if (message.includes("password")) {
          setSignUpPasswordError(message);
        } else if (message.includes("name")) {
          setSignUpNameError(message);
        } else {
          setSignUpEmailError(message);
        }

        setShowSignUpErrors(true);
        setTimeout(() => setShowSignUpErrors(false), 5000);
      }
    } finally {
      setIsSigningUp(false);
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
    <div className="w-full max-w-sm space-y-2 rounded-xl border bg-card p-6 shadow-lg relative overflow-hidden min-h-[520px]">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-200 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 rounded-full filter blur-3xl opacity-20"></div>

      <div
        className={cn(
          "space-y-4 transition-all duration-500 absolute inset-0 p-6",
          showSignUp
            ? "opacity-0 -translate-y-4 pointer-events-none"
            : "opacity-100 translate-y-0 pointer-events-auto"
        )}
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold">Sign In</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {forEmployers
              ? "Access your employer account"
              : "Access your KodJobs account"}
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="email-signin"
                type="email"
                placeholder="Email address"
                className={cn(
                  "h-11",
                  signInEmailError &&
                    "border-red-500 focus-visible:ring-red-500"
                )}
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
              />
              {signInEmailError && (
                <div
                  className={cn(
                    "text-xs text-red-500 mt-1 flex items-center gap-1",
                    showSignInErrors ? "animate-shake" : ""
                  )}
                >
                  <AlertCircle className="h-3 w-3" />
                  {signInEmailError}
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
                  signInPasswordError &&
                    "border-red-500 focus-visible:ring-red-500"
                )}
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
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
              {signInPasswordError && (
                <div
                  className={cn(
                    "text-xs text-red-500 mt-1 flex items-center gap-1",
                    showSignInErrors ? "animate-shake" : ""
                  )}
                >
                  <AlertCircle className="h-3 w-3" />
                  {signInPasswordError}
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
            disabled={isSigningIn}
          >
            {isSigningIn ? (
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

        <div className="relative flex items-center justify-center mt-6">
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

      <div
        className={cn(
          "space-y-4 transition-all duration-500 absolute inset-0 p-6 overflow-y-auto",
          !showSignUp
            ? "opacity-0 translate-y-4 pointer-events-none"
            : "opacity-100 translate-y-0 pointer-events-auto"
        )}
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold">Create Account</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {forEmployers
              ? "Join KodJobs to find top talent"
              : "Join KodJobs to find your dream job"}
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="name"
                placeholder={forEmployers ? "Company name" : "Full name"}
                className={cn(
                  "h-11",
                  signUpNameError && "border-red-500 focus-visible:ring-red-500"
                )}
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
              />
              {signUpNameError && (
                <div
                  className={cn(
                    "text-xs text-red-500 mt-1 flex items-center gap-1",
                    showSignUpErrors ? "animate-shake" : ""
                  )}
                >
                  <AlertCircle className="h-3 w-3" />
                  {signUpNameError}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="email-signup"
                type="email"
                placeholder="Work email"
                className={cn(
                  "h-11",
                  signUpEmailError &&
                    "border-red-500 focus-visible:ring-red-500"
                )}
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
              />
              {signUpEmailError && (
                <div
                  className={cn(
                    "text-xs text-red-500 mt-1 flex items-center gap-1",
                    showSignUpErrors ? "animate-shake" : ""
                  )}
                >
                  <AlertCircle className="h-3 w-3" />
                  {signUpEmailError}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="dob-signup"
                type="date"
                placeholder="Date of birth"
                className={cn(
                  "h-11",
                  signUpDobError && "border-red-500 focus-visible:ring-red-500",
                  "calendar-enhanced" // Custom class for styling
                )}
                onFocus={handleDateFocus}
                value={signUpDob}
                onChange={(e) => setSignUpDob(e.target.value)}
              />
              {signUpDobError && (
                <div
                  className={cn(
                    "text-xs text-red-500 mt-1 flex items-center gap-1",
                    showSignUpErrors ? "animate-shake" : ""
                  )}
                >
                  <AlertCircle className="h-3 w-3" />
                  {signUpDobError}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="password-signup"
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
                className={cn(
                  "h-11",
                  signUpPasswordError &&
                    "border-red-500 focus-visible:ring-red-500"
                )}
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
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
              {signUpPasswordError && (
                <div
                  className={cn(
                    "text-xs text-red-500 mt-1 flex items-center gap-1",
                    showSignUpErrors ? "animate-shake" : ""
                  )}
                >
                  <AlertCircle className="h-3 w-3" />
                  {signUpPasswordError}
                </div>
              )}
            </div>
          </div>
          <Button
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black relative overflow-hidden group h-11"
            type="submit"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
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
          <p className="text-xs text-center text-muted-foreground">
            By signing up, you agree to our{" "}
            <Button variant="link" className="h-auto p-0 text-xs" size="sm">
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button variant="link" className="h-auto p-0 text-xs" size="sm">
              Privacy Policy
            </Button>
          </p>
        </form>

        <div className="relative flex items-center justify-center mt-6">
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
