"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff } from "lucide-react"

export function AuthForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("signin")

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Tabs defaultValue="signin" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="signin" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email-signin">Email</Label>
          <Input id="email-signin" type="email" placeholder="name@example.com" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password-signin">Password</Label>
            <Button variant="link" className="px-0 h-auto text-xs" size="sm">
              Forgot password?
            </Button>
          </div>
          <div className="relative">
            <Input id="password-signin" type={showPassword ? "text" : "password"} placeholder="••••••••" />
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
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>
        </div>
        <Button className="w-full" type="submit">
          Sign In
        </Button>
      </TabsContent>
      <TabsContent value="signup" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email-signup">Email</Label>
          <Input id="email-signup" type="email" placeholder="name@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password-signup">Password</Label>
          <div className="relative">
            <Input id="password-signup" type={showPassword ? "text" : "password"} placeholder="••••••••" />
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
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>
        </div>
        <Button className="w-full" type="submit">
          Create Account
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
      </TabsContent>
    </Tabs>
  )
}

