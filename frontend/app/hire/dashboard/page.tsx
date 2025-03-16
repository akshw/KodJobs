import { CandidateProfiles } from "@/components/candidate-profiles"

export default function HireDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-bold">
                <span className="text-black group-hover:animate-text-gradient transition-all duration-300">Kod</span>
                <span className="text-yellow-500 group-hover:animate-text-gradient transition-all duration-300">
                  Jobs
                </span>
              </span>
            </a>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium hover:text-yellow-500 transition-colors relative group">
              Dashboard
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-500 transition-all duration-300"></span>
            </a>
            <a href="#" className="text-sm font-medium hover:text-yellow-500 transition-colors relative group">
              Job Postings
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="text-sm font-medium hover:text-yellow-500 transition-colors relative group">
              Applications
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#" className="text-sm font-medium hover:text-yellow-500 transition-colors relative group">
              Company Profile
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-yellow-800 font-medium text-sm">TC</span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <CandidateProfiles />
      </main>
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} KodJobs. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

