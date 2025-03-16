import Link from "next/link"
import { AuthSection } from "@/components/auth-section"
import { StatsCounter } from "@/components/stats-counter"
import { FeatureCard } from "@/components/feature-card"
import { Button } from "@/components/ui/button"
import { HeroBackground } from "@/components/hero-background"
import { TalentMatchingSection } from "@/components/talent-matching-section"
import { Users, ChevronRight, BrainCircuit, Search, Clock, UserCheck } from "lucide-react"

export default function HirePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-bold">
                <span className="text-black group-hover:animate-text-gradient transition-all duration-300">Kod</span>
                <span className="text-yellow-500 group-hover:animate-text-gradient transition-all duration-300">
                  Jobs
                </span>
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-yellow-500 transition-colors relative group">
              For Job Seekers
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-yellow-500 transition-colors relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-yellow-500 transition-colors relative group">
              Success Stories
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="#" className="text-sm font-medium hover:text-yellow-500 transition-colors relative group">
              Resources
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" size="sm" className="group overflow-hidden relative">
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">Browse Talent</span>
              <span className="absolute inset-0 bg-yellow-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </Button>
            <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black">
              Post a Job
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
                  AI-Powered Talent Matching
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none animate-slideUp">
                    Hire the Best
                    <span className="block text-yellow-500 relative">
                      Tech Talent
                      <svg
                        className="absolute -bottom-2 left-0 w-full h-2 text-yellow-500"
                        viewBox="0 0 100 10"
                        preserveAspectRatio="none"
                      >
                        <path d="M0,5 Q25,0 50,5 T100,5" fill="none" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </span>
                    For Your Team
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl animate-fadeIn delay-100">
                    Our AI matches your job requirements with qualified candidates, saving you time and resources in the
                    hiring process.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row animate-fadeIn delay-200">
                  <Button
                    size="lg"
                    className="gap-1 group relative overflow-hidden bg-yellow-500 hover:bg-yellow-500 text-black"
                  >
                    <span className="relative z-10">Post a Job</span>
                    <ChevronRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <span className="absolute inset-0 bg-yellow-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                  </Button>
                  <Button variant="outline" size="lg" className="group relative overflow-hidden">
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                      Browse Talent
                    </span>
                    <Search className="ml-2 h-4 w-4 relative z-10" />
                    <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-6 animate-fadeIn delay-300">
                  <StatsCounter
                    icon={<Users className="h-5 w-5 text-yellow-500" />}
                    value={50000}
                    label="Active Candidates"
                    duration={2000}
                  />
                  <StatsCounter
                    icon={<Clock className="h-5 w-5 text-yellow-500" />}
                    value={72}
                    suffix="h"
                    label="Avg. Time to Hire"
                    duration={2000}
                  />
                  <StatsCounter
                    icon={<UserCheck className="h-5 w-5 text-yellow-500" />}
                    value={92}
                    suffix="%"
                    label="Satisfaction Rate"
                    duration={2000}
                  />
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-end animate-fadeIn delay-400">
                <AuthSection forEmployers={true} />
              </div>
            </div>
          </div>
        </section>

        <TalentMatchingSection />

        <section className="w-full py-12 md:py-20 bg-gradient-to-b from-muted/30 to-muted/80">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-block rounded-lg bg-yellow-100 px-3 py-1 text-sm text-yellow-800">
                  Why Employers Choose KodJobs
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Streamline Your Hiring Process
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Our platform helps you find the right candidates faster and more efficiently.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-10 md:grid-cols-3 md:gap-10">
              <FeatureCard
                icon={<Search className="h-10 w-10 text-yellow-500" />}
                title="Smart Matching"
                description="Our AI algorithm matches your job requirements with qualified candidates based on skills and experience."
              />
              <FeatureCard
                icon={<Clock className="h-10 w-10 text-yellow-500" />}
                title="Time Saving"
                description="Reduce time-to-hire by up to 50% with our streamlined recruitment process and pre-screened candidates."
              />
              <FeatureCard
                icon={<UserCheck className="h-10 w-10 text-yellow-500" />}
                title="Quality Candidates"
                description="Access a pool of verified tech professionals with validated skills and experience."
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
                  Flexible Hiring
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight relative z-10">
                  Find the Perfect Fit
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed relative z-10">
                  Whether you need full-time employees, contractors, or remote workers, we have the talent pool to meet
                  your needs.
                </p>
                <div className="relative z-10">
                  <Button
                    size="lg"
                    className="gap-1 group relative overflow-hidden bg-yellow-500 hover:bg-yellow-500 text-black"
                  >
                    <span className="relative z-10">Post a Job</span>
                    <ChevronRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <span className="absolute inset-0 bg-yellow-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                  </Button>
                </div>
              </div>
              <div className="space-y-4 relative">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="inline-block rounded-lg bg-yellow-100 px-3 py-1 text-sm text-yellow-800 relative z-10">
                  Enterprise Solutions
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight relative z-10">Scale Your Team</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed relative z-10">
                  Custom hiring solutions for enterprises with high volume recruitment needs. Our dedicated account
                  managers help you scale efficiently.
                </p>
                <div className="relative z-10">
                  <Button size="lg" variant="outline" className="gap-1 group relative overflow-hidden">
                    <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                      Contact Sales
                    </span>
                    <ChevronRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
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
                  Ready to Build Your{" "}
                  <span className="text-yellow-500 relative">
                    Dream Team?
                    <svg
                      className="absolute -bottom-2 left-0 w-full h-2 text-yellow-500"
                      viewBox="0 0 100 10"
                      preserveAspectRatio="none"
                    >
                      <path d="M0,5 Q25,0 50,5 T100,5" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </span>
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl/relaxed">
                  Join thousands of companies who've found their perfect tech talent through KodJobs.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  size="lg"
                  className="gap-1 bg-yellow-500 hover:bg-yellow-600 text-black group relative overflow-hidden"
                >
                  <span className="relative z-10">Post a Job</span>
                  <ChevronRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <span className="absolute inset-0 bg-yellow-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                </Button>
                <Button variant="outline" size="lg" className="border-white hover:bg-white/10 group">
                  <span>Schedule a Demo</span>
                  <span className="ml-2 inline-block group-hover:translate-x-0.5 transition-transform">→</span>
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
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

