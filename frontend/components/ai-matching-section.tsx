"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BrainCircuit, FileText, Mail, Briefcase, ArrowRight, CheckCircle, Loader2, Sparkles, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export function AIMatchingSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationVariant, setAnimationVariant] = useState(0)

  // Cycle through animation variants
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationVariant((prev) => (prev + 1) % 3)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const steps = [
    {
      icon: <FileText className="h-10 w-10 text-yellow-500" />,
      title: "Upload Your Resume",
      description: "Our AI analyzes your skills, experience, and career goals",
    },
    {
      icon: <BrainCircuit className="h-10 w-10 text-yellow-500" />,
      title: "AI Matching",
      description: "Advanced algorithms match you with the perfect opportunities",
    },
    {
      icon: <Mail className="h-10 w-10 text-yellow-500" />,
      title: "Personalized Emails",
      description: "Receive tailored job recommendations directly to your inbox",
    },
    {
      icon: <Briefcase className="h-10 w-10 text-yellow-500" />,
      title: "Apply & Track",
      description: "Apply with one click and track your application status",
    },
  ]

  const handleNextStep = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
      setIsAnimating(false)
    }, 500)
  }

  // Animation variants for the AI section
  const getAnimationClass = () => {
    switch (animationVariant) {
      case 0:
        return "animate-float"
      case 1:
        return "animate-pulse"
      case 2:
        return "animate-bounce-slow"
      default:
        return "animate-float"
    }
  }

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-white to-muted/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>

      {/* Dynamic background elements with different animations */}
      <div className="absolute -left-20 top-40 w-40 h-40 bg-yellow-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -right-20 bottom-40 w-40 h-40 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-float"></div>

      {/* Animated particles */}
      <div className="absolute left-1/4 top-1/3 w-6 h-6 bg-yellow-400 rounded-full filter blur-sm opacity-30 animate-float"></div>
      <div className="absolute right-1/4 top-2/3 w-4 h-4 bg-yellow-300 rounded-full filter blur-sm opacity-20 animate-float-delayed"></div>
      <div className="absolute left-1/3 bottom-1/4 w-5 h-5 bg-blue-300 rounded-full filter blur-sm opacity-20 animate-float-reverse"></div>

      {/* Animated sparkles */}
      <div className="absolute left-1/5 top-1/4">
        <Sparkles className="h-6 w-6 text-yellow-400 opacity-60 animate-pulse" />
      </div>
      <div className="absolute right-1/5 top-2/3">
        <Sparkles className="h-4 w-4 text-yellow-300 opacity-50 animate-pulse-delayed" />
      </div>
      <div className="absolute left-2/3 bottom-1/3">
        <Zap className="h-5 w-5 text-yellow-500 opacity-40 animate-bounce-slow" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-yellow-100 text-yellow-900",
              getAnimationClass(),
            )}
          >
            <BrainCircuit className="mr-1 h-3 w-3" />
            AI-Powered
          </div>
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight animate-fade-in">
              Personalized Job Matching with AI
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed animate-fade-in-delayed">
              Our AI analyzes your resume and skills to deliver tailored job recommendations directly to your inbox.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col justify-center space-y-8 animate-slide-in-left">
            {steps.map((step, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start space-x-4 transition-all duration-300",
                  activeStep === index ? "opacity-100" : "opacity-50",
                  activeStep === index ? "scale-105" : "scale-100",
                  "hover:opacity-90 cursor-pointer",
                )}
                onClick={() => setActiveStep(index)}
              >
                <div
                  className={cn(
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    activeStep === index ? "border-yellow-500 bg-yellow-100" : "border-muted-foreground/20 bg-muted/20",
                    activeStep === index ? getAnimationClass() : "",
                  )}
                >
                  {step.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center animate-slide-in-right">
            <Card
              className={cn(
                "w-full max-w-md overflow-hidden border-2 border-yellow-100 shadow-lg",
                getAnimationClass(),
              )}
            >
              <CardContent className="p-6">
                <div
                  className={cn(
                    "space-y-6 transition-all duration-500",
                    isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={cn(
                          "h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center",
                          getAnimationClass(),
                        )}
                      >
                        {steps[activeStep].icon}
                      </div>
                      <div>
                        <h4 className="font-bold">{steps[activeStep].title}</h4>
                        <p className="text-xs text-muted-foreground">
                          Step {activeStep + 1} of {steps.length}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("rounded-full", getAnimationClass())}
                      onClick={handleNextStep}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {activeStep === 0 && (
                    <div className="space-y-4">
                      <div className="h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/30 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-yellow-50 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        <div className="text-center relative z-10">
                          <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground group-hover:text-yellow-500 transition-colors" />
                          <p className="text-sm font-medium">Drag & drop your resume</p>
                          <p className="text-xs text-muted-foreground">or click to browse</p>
                        </div>
                      </div>
                      <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black group relative overflow-hidden">
                        <span className="relative z-10">Upload Resume</span>
                        <span className="absolute inset-0 bg-yellow-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                      </Button>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="space-y-4">
                      <div className="h-32 rounded-lg bg-muted/30 flex items-center justify-center overflow-hidden relative">
                        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                        <div className="relative z-10 text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Loader2 className="h-8 w-8 text-yellow-500 animate-spin" />
                          </div>
                          <p className="text-sm font-medium">Analyzing your profile</p>
                          <p className="text-xs text-muted-foreground">Identifying skills and experience</p>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Processing...</span>
                        <span className="font-medium">68%</span>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                        <div className="bg-yellow-500 h-2 rounded-full animate-progress" style={{ width: "68%" }}></div>
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="space-y-4">
                      <div className="h-32 rounded-lg bg-muted/10 border p-3 flex flex-col">
                        <div className="flex items-center space-x-2 mb-2">
                          <Mail className="h-4 w-4 text-yellow-500" />
                          <h5 className="text-sm font-medium">Daily Job Matches</h5>
                        </div>
                        <div className="text-xs space-y-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>Personalized job recommendations</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>Salary insights and company details</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>Skills match percentage</span>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black group relative overflow-hidden">
                        <span className="relative z-10">Set Email Preferences</span>
                        <span className="absolute inset-0 bg-yellow-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                      </Button>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="space-y-4">
                      <div className="h-32 rounded-lg bg-muted/10 border p-3 overflow-y-auto">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b pb-2">
                            <div>
                              <p className="text-sm font-medium">Senior React Developer</p>
                              <p className="text-xs text-muted-foreground">TechCorp Inc.</p>
                            </div>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              95% Match
                            </span>
                          </div>
                          <div className="flex items-center justify-between border-b pb-2">
                            <div>
                              <p className="text-sm font-medium">Frontend Team Lead</p>
                              <p className="text-xs text-muted-foreground">InnovateTech</p>
                            </div>
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                              87% Match
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Full Stack Engineer</p>
                              <p className="text-xs text-muted-foreground">StartupXYZ</p>
                            </div>
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                              82% Match
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black group relative overflow-hidden">
                        <span className="relative z-10">View All Matches</span>
                        <span className="absolute inset-0 bg-yellow-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

