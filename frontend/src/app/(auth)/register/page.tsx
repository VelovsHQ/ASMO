"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (e: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmError("");
    
    let hasError = false;
    
    if (!name.trim()) {
      setNameError("Full name is required");
      hasError = true;
    }
    
    if (!email) {
      setEmailError("Email address is required");
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }
    
    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      hasError = true;
    }
    
    if (!confirmPassword) {
      setConfirmError("Please confirm your password");
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmError("Passwords do not match");
      hasError = true;
    }
    
    if (hasError) return;
    
    setIsLoading(true);
    
    // MOCK AUTH: Simulate network request
    setTimeout(() => {
      login({
        name: name.trim(),
        email: email
      });
      
      // MOCK REDIRECT LOGIC: New users always go to onboarding
      router.push("/onboarding");
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md flex flex-col gap-8 my-8">
        
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">ASMO</h1>
          </Link>
        </div>
        
        {/* Registration Card */}
        <div className="bg-muted/10 border border-border rounded-3xl p-8 shadow-lg flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Create an account</h2>
            <p className="text-sm text-muted-foreground font-medium">Join ASMO to unlock AI market intelligence</p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Full Name Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError("");
                }}
                placeholder="John Doe"
                className={`bg-background border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all ${
                  nameError ? "border-red-500" : "border-border focus:border-accent"
                }`}
              />
              {nameError && <span className="text-xs font-semibold text-red-500 mt-1 ml-1">{nameError}</span>}
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                placeholder="name@example.com"
                className={`bg-background border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all ${
                  emailError ? "border-red-500" : "border-border focus:border-accent"
                }`}
              />
              {emailError && <span className="text-xs font-semibold text-red-500 mt-1 ml-1">{emailError}</span>}
            </div>
            
            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  placeholder="••••••••"
                  className={`bg-background border rounded-xl pl-4 pr-10 py-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all ${
                    passwordError ? "border-red-500" : "border-border focus:border-accent"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordError && <span className="text-xs font-semibold text-red-500 mt-1 ml-1">{passwordError}</span>}
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (confirmError) setConfirmError("");
                  }}
                  placeholder="••••••••"
                  className={`bg-background border rounded-xl pl-4 pr-10 py-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all ${
                    confirmError ? "border-red-500" : "border-border focus:border-accent"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmError && <span className="text-xs font-semibold text-red-500 mt-1 ml-1">{confirmError}</span>}
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground py-3 rounded-xl text-sm font-bold shadow-sm hover:bg-accent/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          
          {/* Log In Link */}
          <div className="text-center mt-2">
            <span className="text-sm font-medium text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:underline font-bold">
                Log in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
