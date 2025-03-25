"use client";
import Link from "next/link";
import { AuthSection } from "@/components/auth-section";
import { StatsCounter } from "@/components/stats-counter";
import { FeatureCard } from "@/components/feature-card";
import { Button } from "@/components/ui/button";
import { AIMatchingSection } from "@/components/ai-matching-section";
import { HeroBackground } from "@/components/hero-background";
import {
  Briefcase,
  Building2,
  Users,
  ChevronRight,
  CheckCircle,
  Zap,
  Award,
  BrainCircuit,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-bold">
                <span className="text-black group-hover:animate-text-gradient transition-all duration-300">
                  Kod
                </span>
                <span className="text-yellow-500 group-hover:animate-text-gradient transition-all duration-300">
                  Jobs
                </span>
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/hire"
              className="text-sm font-medium hover:text-yellow-500 transition-colors relative group"
            >
              For Employers
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              onClick={() => alert("Sign in to browse jobs")}
              href="#"
              className="text-sm font-medium hover:text-yellow-500 transition-colors relative group"
            >
              Browse Jobs
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="https://www.kodnest.com"
              className="text-sm font-medium hover:text-yellow-500 transition-colors relative group"
            >
              Resources
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="https://www.kodnest.com/blog"
              className="text-sm font-medium hover:text-yellow-500 transition-colors relative group"
            >
              Blog
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <Button
              size="sm"
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
              onClick={() => alert("Sign in to get started")}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-6 md:py-12 lg:py-16 relative overflow-hidden">
          <HeroBackground />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_450px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-yellow-100 text-yellow-900 animate-fadeIn">
                  <BrainCircuit className="mr-1 h-3 w-3" />
                  AI-Powered Job Matching
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none animate-slideUp">
                    Find Your Best
                    <span className="block text-yellow-500 relative">
                      Tech Career
                      <svg
                        className="absolute -bottom-2 left-0 w-full h-2 text-yellow-500"
                        viewBox="0 0 100 10"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0,5 Q25,0 50,5 T100,5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    </span>
                    Opportunity
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl animate-fadeIn delay-100">
                    Our AI analyzes your resume and skills to deliver
                    personalized job recommendations that match you the best.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row animate-fadeIn delay-200">
                  <Button
                    size="lg"
                    className="gap-1 group relative overflow-hidden bg-yellow-500 hover:bg-yellow-500 text-black"
                    onClick={() => alert("Sign in to browse jobs")}
                  >
                    <span className="relative z-10">Browse Jobs</span>
                    <ChevronRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <span className="absolute inset-0 bg-yellow-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                  </Button>
                  {/* <Button
                    size="lg"
                    className="gap-1 mx-10 group relative overflow-hidden bg-yellow-500 hover:bg-yellow-500 text-black"
                    onClick={() => alert("Sign in and create profile")}
                  >
                    <span className="relative z-10">Create Profile</span>
                    <ChevronRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <span className="absolute inset-0 bg-yellow-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                  </Button> */}
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-1 mx-4 group relative overflow-hidden"
                    asChild
                    onClick={() => alert("Sign in to create profile")}
                  >
                    <Link href="">
                      <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                        Create Profile
                      </span>
                      <ChevronRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                      <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                    </Link>
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-6 animate-fadeIn delay-300">
                  <StatsCounter
                    icon={<Briefcase className="h-5 w-5 text-yellow-500" />}
                    value={100}
                    suffix="+"
                    label="Active Jobs"
                    duration={2000}
                  />
                  <StatsCounter
                    icon={<Building2 className="h-5 w-5 text-yellow-500" />}
                    value={50}
                    suffix="+"
                    label="Companies"
                    duration={2000}
                  />
                  <StatsCounter
                    icon={<Users className="h-5 w-5 text-yellow-500" />}
                    value={90}
                    suffix="%"
                    label="Placement Rate"
                    duration={2000}
                  />
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-end animate-fadeIn delay-400">
                <AuthSection forEmployers={false} />
              </div>
            </div>
          </div>
        </section>

        <AIMatchingSection />

        <section className="w-full py-12 md:py-20 bg-gradient-to-b from-muted/30 to-muted/80">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-block rounded-lg bg-yellow-100 px-3 py-1 text-sm text-yellow-800">
                  Why KodJobs
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  The Smarter Way to Find Tech Jobs
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  We connect talented developers with innovative companies
                  looking for their skills.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-10 md:grid-cols-3 md:gap-10">
              <FeatureCard
                icon={<CheckCircle className="h-10 w-10 text-yellow-500" />}
                title="Verified Jobs"
                description="Every job listing is verified to ensure quality opportunities from legitimate employers."
              />
              <FeatureCard
                icon={<Zap className="h-10 w-10 text-yellow-500" />}
                title="Smart Matching"
                description="Our AI-powered matching system connects you with jobs that fit your skills and preferences."
              />
              <FeatureCard
                icon={<Award className="h-10 w-10 text-yellow-500" />}
                title="Career Growth"
                description="Access resources, salary insights, and interview prep to advance your tech career."
              />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-10 px-6 md:gap-16 lg:grid-cols-2">
              <div className="space-y-4 relative">
                <div className="absolute -left-10 -top-10 w-40 h-40 bg-yellow-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="inline-block rounded-lg bg-yellow-100 px-3 py-1 text-sm text-yellow-800 relative z-10">
                  For Job Seekers
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight relative z-10">
                  Find Your Dream Tech Job
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed relative z-10">
                  Browse thousands of curated tech jobs from top companies and
                  startups. Apply with a single click and track your
                  applications.
                </p>
                <div className="relative z-10">
                  <Button
                    size="lg"
                    className="gap-1 group relative overflow-hidden bg-yellow-500 hover:bg-yellow-500 text-black"
                    onClick={() => alert("Sign in to create profile")}
                  >
                    <span className="relative z-10">Create Profile</span>
                    <ChevronRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <span className="absolute inset-0 bg-yellow-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                  </Button>
                </div>
              </div>
              <div className="space-y-4 relative">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="inline-block rounded-lg bg-yellow-100 px-3 py-1 text-sm text-yellow-800 relative z-10">
                  For Employers
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight relative z-10">
                  Hire Top Tech Talent
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed relative z-10">
                  Post jobs, screen candidates, and build your tech team
                  efficiently. Our platform connects you with qualified
                  developers.
                </p>
                <div className="relative z-10">
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-1 group relative overflow-hidden"
                    asChild
                  >
                    <Link href="/hire">
                      <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                        Post a Job
                      </span>
                      <ChevronRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                      <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-20 bg-black text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.2),transparent_40%)]"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to Find Your Next{" "}
                  <span className="text-yellow-500 relative">
                    Opportunity?
                    <svg
                      className="absolute -bottom-2 left-0 w-full h-2 text-yellow-500"
                      viewBox="0 0 100 10"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,5 Q25,0 50,5 T100,5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </span>
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl/relaxed">
                  Join thousands of tech professionals who have found their
                  dream jobs through KodJobs.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  size="lg"
                  className="gap-1 bg-yellow-500 hover:bg-yellow-600 text-black group relative overflow-hidden"
                  onClick={() => alert("Sign in to get started")}
                >
                  <span className="relative z-10">Get Started</span>
                  <ChevronRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <span className="absolute inset-0 bg-yellow-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white hover:bg-yellow-500 group text-black"
                >
                  <Link href="https://www.kodnest.com/">
                    <span>Learn More</span>
                    <span className="ml-2 inline-block group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} KodJobs. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
