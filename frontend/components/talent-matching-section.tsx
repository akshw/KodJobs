"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BrainCircuit,
  Mail,
  Briefcase,
  ArrowRight,
  Loader2,
  Search,
  Filter,
  Users,
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function TalentMatchingSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { ref } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const steps = [
    {
      icon: <Briefcase className="h-10 w-10 text-yellow-500" />,
      title: "Post Your Job",
      description:
        "Describe your requirements, skills needed, and company culture",
    },
    {
      icon: <BrainCircuit className="h-10 w-10 text-yellow-500" />,
      title: "AI Matching",
      description:
        "Our algorithm finds candidates that match your specific needs",
    },
    {
      icon: <Users className="h-10 w-10 text-yellow-500" />,
      title: "Review Candidates",
      description: "Browse pre-screened candidates ranked by match percentage",
    },
    {
      icon: <Mail className="h-10 w-10 text-yellow-500" />,
      title: "Connect & Hire",
      description:
        "Contact candidates directly and streamline your hiring process",
    },
  ];

  const handleNextStep = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <section
      ref={ref}
      className="w-full py-16 md:py-24 bg-gradient-to-b from-white to-muted/30 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute -left-20 top-40 w-40 h-40 bg-yellow-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -right-20 bottom-40 w-40 h-40 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>

      <div className="container px-4 md:px-6">
        <div
          className={cn(
            "flex flex-col items-center justify-center space-y-4 text-center transition-all duration-700",
            "opacity-100 translate-y-0" // Remove the inView conditional to always show content
          )}
        >
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-yellow-100 text-yellow-900">
            <BrainCircuit className="mr-1 h-3 w-3" />
            AI-Powered
          </div>
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Find the Perfect Candidates
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Our AI matching technology helps you find qualified candidates
              that fit your specific requirements.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div
            className={cn(
              "flex flex-col justify-center space-y-8 transition-all duration-700 delay-300",
              "opacity-100 translate-x-0" // Remove the inView conditional
            )}
          >
            {steps.map((step, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start space-x-4 transition-all duration-300",
                  activeStep === index ? "opacity-100" : "opacity-50"
                )}
              >
                <div
                  className={cn(
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    activeStep === index
                      ? "border-yellow-500 bg-yellow-100"
                      : "border-muted-foreground/20 bg-muted/20"
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

          <div
            className={cn(
              "flex items-center justify-center transition-all duration-700 delay-500",
              "opacity-100 translate-x-0" // Remove the inView conditional
            )}
          >
            <Card className="w-full max-w-md overflow-hidden border-2 border-yellow-100">
              <CardContent className="p-6">
                <div
                  className={cn(
                    "space-y-6 transition-all duration-500",
                    isAnimating
                      ? "opacity-0 translate-y-4"
                      : "opacity-100 translate-y-0"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
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
                      className="rounded-full"
                      onClick={handleNextStep}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {activeStep === 0 && (
                    <div className="space-y-4">
                      <div className="h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/30">
                        <div className="text-center">
                          <Briefcase className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm font-medium">
                            Create a job posting
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Describe your ideal candidate
                          </p>
                        </div>
                      </div>
                      <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                        Post a Job
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
                          <p className="text-sm font-medium">
                            Matching candidates
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Finding the best talent for your needs
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Processing...
                        </span>
                        <span className="font-medium">78%</span>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full animate-pulse"
                          style={{ width: "78%" }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="space-y-4">
                      <div className="h-32 rounded-lg bg-muted/10 border p-3 overflow-y-auto">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b pb-2">
                            <div>
                              <p className="text-sm font-medium">
                                Sarah Johnson
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Senior React Developer
                              </p>
                            </div>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              95% Match
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between border-b pb-2">
                            <div>
                              <p className="text-sm font-medium">
                                Michael Chen
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Full Stack Engineer
                              </p>
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                              87% Match
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">
                                Alex Rodriguez
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Frontend Developer
                              </p>
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                              82% Match
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                        <Button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black">
                          <Search className="h-4 w-4 mr-2" />
                          View All
                        </Button>
                      </div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="space-y-4">
                      <div className="h-32 rounded-lg bg-muted/10 border p-3 overflow-y-auto">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between border-b pb-2">
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                <Users className="h-4 w-4 text-yellow-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  Sarah Johnson
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Available for interview
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="h-8">
                              Contact
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                <Users className="h-4 w-4 text-yellow-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  Michael Chen
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Reviewing your offer
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="h-8">
                              Message
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                        Manage Candidates
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
  );
}
