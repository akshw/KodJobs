// import React, { useEffect, useState } from "react";
// import {
//   Search,
//   SlidersHorizontal,
//   Bookmark,
//   LayoutGrid,
//   List,
//   ArrowRight,
//   Building,
//   Clock,
//   MapPin,
//   User,
// } from "lucide-react";
// import { format } from "date-fns";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";

// // Define our new primary color
// const primaryColor = "blue";

// interface Job {
//   id: number;
//   jobid: number;
//   jobPoster: string;
//   title: string;
//   date_time: string;
//   ApplyUrl: string;
// }

// interface JobCardProps {
//   job: Job;
//   viewMode: string;
// }

// const JobCard: React.FC<JobCardProps> = ({ job, viewMode }) => {
//   return (
//     <Card
//       className={`border rounded-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.03] hover:border-[${primaryColor}] flex flex-col justify-between
//         ${
//           viewMode === "grid"
//             ? "p-6 h-full bg-gradient-to-b from-white to-gray-50"
//             : "p-5 flex-row items-center gap-4 bg-white"
//         }`}
//     >
//       {viewMode === "grid" ? (
//         // Grid View
//         <>
//           <div className="flex justify-between items-start mb-4">
//             <div>
//               <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
//               <p className={`font-medium text-[${primaryColor}]`}>YC Company</p>
//             </div>
//             <div className={`bg-[${primaryColor}]/10 p-2 rounded-full`}>
//               <Building className={`text-[${primaryColor}] h-5 w-5`} />
//             </div>
//           </div>

//           <div className="space-y-3 mb-4 flex-grow">
//             <div className="flex items-center text-sm text-gray-600">
//               <User className={`h-4 w-4 mr-2 text-[${primaryColor}]`} />
//               <span>Posted by: {job.jobPoster}</span>
//             </div>
//             <div className="flex items-center text-sm text-gray-600">
//               <Clock className={`h-4 w-4 mr-2 text-[${primaryColor}]`} />
//               <span>{format(new Date(job.date_time), "MMM dd, yyyy")}</span>
//             </div>
//             <div className="flex items-center text-sm text-gray-600">
//               <MapPin className={`h-4 w-4 mr-2 text-[${primaryColor}]`} />
//               <span>Remote/On-site</span>
//             </div>
//           </div>

//           <Button
//             className={`w-full bg-[${primaryColor}] hover:bg-[${primaryColor}]/80 text-white transition-all duration-300 transform hover:-translate-y-1 mt-auto group`}
//             onClick={() => window.open(job.ApplyUrl, "_blank")}
//           >
//             Apply Now{" "}
//             <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
//           </Button>
//         </>
//       ) : (
//         // List View
//         <>
//           <div className="flex-grow flex items-center gap-4">
//             <div
//               className={`bg-[${primaryColor}]/10 p-3 rounded-full hidden sm:block`}
//             >
//               <Building className={`text-[${primaryColor}] h-6 w-6`} />
//             </div>

//             <div className="flex-grow">
//               <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
//               <div className="flex flex-wrap gap-3 mt-1.5">
//                 <div className="flex items-center text-sm text-gray-600">
//                   <User className={`h-3.5 w-3.5 mr-1 text-[${primaryColor}]`} />
//                   <span>{job.jobPoster}</span>
//                 </div>
//                 <div className="flex items-center text-sm text-gray-600">
//                   <Clock
//                     className={`h-3.5 w-3.5 mr-1 text-[${primaryColor}]`}
//                   />
//                   <span>{format(new Date(job.date_time), "MMM dd, yyyy")}</span>
//                 </div>
//                 <Badge
//                   variant="outline"
//                   className={`bg-[${primaryColor}]/10 text-[${primaryColor}] rounded-full text-xs`}
//                 >
//                   Remote
//                 </Badge>
//               </div>
//             </div>
//           </div>

//           <Button
//             className={`bg-[${primaryColor}] hover:bg-[${primaryColor}]/80 text-white transition-all duration-300 transform hover:scale-105 whitespace-nowrap shrink-0 group`}
//             onClick={() => window.open(job.ApplyUrl, "_blank")}
//           >
//             Apply{" "}
//             <ArrowRight className="ml-1 h-4 w-4 hidden sm:inline group-hover:translate-x-1 transition-transform duration-300" />
//           </Button>
//         </>
//       )}
//     </Card>
//   );
// };

// export const JobDashboard: React.FC = () => {
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("all");
//   const [viewMode, setViewMode] = useState("grid");
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:4000/api/dashboard/jobs"
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch jobs");
//         }
//         const data = await response.json();
//         setJobs(data.jobs);
//         setFilteredJobs(data.jobs);
//         toast.success("Jobs loaded successfully!");
//       } catch (error) {
//         console.error("Error fetching jobs:", error);
//         toast.error("Failed to load jobs");

//         // Use sample data if API fails
//         const sampleJobs = [
//           {
//             id: 10,
//             jobid: 43375123,
//             jobPoster: "ankerbachryhl",
//             title: "Parahelp (YC S24) Is Hiring Founding Engineers (SF)",
//             date_time: "2025-03-15T21:00:44.000Z",
//             ApplyUrl:
//               "https://www.ycombinator.com/companies/parahelp/jobs/PhUMEwg-founding-ai-engineer",
//           },
//           {
//             id: 7,
//             jobid: 43373728,
//             jobPoster: "edreichua",
//             title: "Stellar Sleep (YC S23) Is Hiring",
//             date_time: "2025-03-15T17:00:12.000Z",
//             ApplyUrl:
//               "https://www.ycombinator.com/companies/stellar-sleep/jobs/Yb9IzAW-founding-product-engineer",
//           },
//         ];

//         setJobs(sampleJobs);
//         setFilteredJobs(sampleJobs);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, []);

//   // Fix search functionality
//   useEffect(() => {
//     // Apply filters whenever search term or active tab changes
//     let results = [...jobs];

//     // Apply search filter - make it case insensitive
//     if (searchTerm.trim() !== "") {
//       const searchTermLower = searchTerm.toLowerCase();
//       results = results.filter(
//         (job) =>
//           job.title.toLowerCase().includes(searchTermLower) ||
//           job.jobPoster.toLowerCase().includes(searchTermLower)
//       );
//     }

//     // Apply tab filter
//     if (activeTab === "featured") {
//       // For demo purposes, let's assume first job is featured
//       results = results.filter((job) => job.id === 10);
//     } else if (activeTab === "remote") {
//       // For demo, all jobs are remote
//       // No additional filtering needed
//     }

//     setFilteredJobs(results);
//   }, [searchTerm, activeTab, jobs]);

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleTabChange = (value: string) => {
//     setActiveTab(value);
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
//       {/* Updated header with new gradient and animation */}
//       <div
//         className={`mb-8 bg-gradient-to-r from-[${primaryColor}]/10 to-white p-8 rounded-xl shadow-sm transition-all duration-500 hover:shadow-md`}
//       >
//         <h1 className="text-3xl font-bold mb-2 text-gray-800 animate-fade-in">
//           Job Dashboard
//         </h1>
//         <p className="text-gray-600 max-w-2xl animate-fade-in">
//           Browse through our curated list of tech jobs that match your skills
//           and preferences. Find opportunities at YC-backed companies and take
//           the next step in your career.
//         </p>
//       </div>

//       <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
//         <div className="relative w-full md:w-2/3">
//           <Search
//             className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-[${primaryColor}]`}
//             size={18}
//           />
//           <Input
//             className={`pl-10 w-full border border-gray-200 rounded-md focus:border-[${primaryColor}] focus:ring-1 focus:ring-[${primaryColor}]`}
//             placeholder="Search jobs, skills, or companies..."
//             onChange={handleSearch}
//             value={searchTerm}
//           />
//         </div>
//         <div className="flex gap-2 flex-wrap">
//           <Button
//             variant="outline"
//             className={`flex items-center gap-2 hover:bg-[${primaryColor}]/10 hover:text-[${primaryColor}] transition-colors duration-200 border-gray-200`}
//           >
//             <SlidersHorizontal size={18} />
//             Filters
//           </Button>
//           <Button
//             variant="outline"
//             className={`flex items-center gap-2 hover:bg-[${primaryColor}]/10 hover:text-[${primaryColor}] transition-colors duration-200 border-gray-200`}
//           >
//             <Bookmark size={18} />
//             Saved
//           </Button>
//           {/* View mode selection moved next to Saved button */}
//           <div className="flex border rounded-md border-gray-200">
//             <Button
//               variant="ghost"
//               className={`px-3 ${
//                 viewMode === "grid"
//                   ? `bg-[${primaryColor}]/10 text-[${primaryColor}]`
//                   : ""
//               } transition-colors duration-200`}
//               onClick={() => setViewMode("grid")}
//             >
//               <LayoutGrid size={18} />
//             </Button>
//             <Button
//               variant="ghost"
//               className={`px-3 ${
//                 viewMode === "list"
//                   ? `bg-[${primaryColor}]/10 text-[${primaryColor}]`
//                   : ""
//               } transition-colors duration-200`}
//               onClick={() => setViewMode("list")}
//             >
//               <List size={18} />
//             </Button>
//           </div>
//         </div>
//       </div>

//       <Tabs defaultValue="all" className="mb-8" onValueChange={handleTabChange}>
//         <TabsList className="bg-gray-100">
//           <TabsTrigger
//             value="all"
//             className={`data-[state=active]:bg-white data-[state=active]:text-[${primaryColor}] data-[state=active]:shadow-sm`}
//           >
//             All Jobs
//           </TabsTrigger>
//           <TabsTrigger
//             value="featured"
//             className={`data-[state=active]:bg-white data-[state=active]:text-[${primaryColor}] data-[state=active]:shadow-sm`}
//           >
//             Featured
//           </TabsTrigger>
//           <TabsTrigger
//             value="remote"
//             className={`data-[state=active]:bg-white data-[state=active]:text-[${primaryColor}] data-[state=active]:shadow-sm`}
//           >
//             Remote
//           </TabsTrigger>
//         </TabsList>
//       </Tabs>

//       {/* Search result count and summary */}
//       {!loading && (
//         <div className="mb-4 text-sm text-gray-500">
//           Showing {filteredJobs.length}{" "}
//           {filteredJobs.length === 1 ? "job" : "jobs"}
//           {searchTerm ? ` for "${searchTerm}"` : ""}
//         </div>
//       )}

//       {/* Loading skeleton */}
//       {loading ? (
//         <div
//           className={`grid grid-cols-1 ${
//             viewMode === "grid"
//               ? "md:grid-cols-2 lg:grid-cols-3"
//               : "md:grid-cols-1"
//           } gap-6`}
//         >
//           {[1, 2, 3, 4, 5, 6].map((_, index) => (
//             <Card key={index} className="p-6 h-[250px] animate-pulse">
//               <Skeleton className="h-8 w-2/3 mb-2" />
//               <Skeleton className="h-4 w-1/3 mb-4" />
//               <div className="space-y-3 mb-4">
//                 <Skeleton className="h-4 w-full" />
//                 <Skeleton className="h-4 w-full" />
//                 <Skeleton className="h-4 w-full" />
//               </div>
//               <Skeleton className="h-10 w-full mt-auto" />
//             </Card>
//           ))}
//         </div>
//       ) : (
//         // Jobs grid with enhanced animations
//         <div
//           className={`grid grid-cols-1 ${
//             viewMode === "grid"
//               ? "md:grid-cols-2 lg:grid-cols-3"
//               : "md:grid-cols-1"
//           } gap-6 animate-fade-in`}
//         >
//           {filteredJobs.length > 0 ? (
//             filteredJobs.map((job, index) => (
//               <div
//                 key={job.id}
//                 className="animate-fade-in"
//                 style={{ animationDelay: `${index * 0.1}s` }}
//               >
//                 <JobCard job={job} viewMode={viewMode} />
//               </div>
//             ))
//           ) : (
//             <div className="col-span-full text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300 animate-fade-in">
//               <p className="text-gray-500 mb-3">
//                 No jobs found matching your criteria.
//               </p>
//               <Button
//                 variant="outline"
//                 className={`mt-4 hover:bg-[${primaryColor}]/10 hover:text-[${primaryColor}] transition-colors duration-200`}
//                 onClick={() => {
//                   setFilteredJobs(jobs);
//                   setActiveTab("all");
//                   setSearchTerm("");
//                 }}
//               >
//                 Reset Filters
//               </Button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Bookmark,
  LayoutGrid,
  List,
  ArrowRight,
  Building,
  Clock,
  MapPin,
  User,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Job {
  id: number;
  jobid: number;
  jobPoster: string;
  title: string;
  date_time: string;
  ApplyUrl: string;
}

interface JobCardProps {
  job: Job;
  viewMode: string;
}

const JobCard: React.FC<JobCardProps> = ({ job, viewMode }) => {
  // Use client-side formatting inside useEffect
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    // Format date on client side after component mounts
    try {
      setFormattedDate(format(parseISO(job.date_time), "MMM dd, yyyy"));
    } catch (error) {
      setFormattedDate("Invalid date" + error);
    }
  }, [job.date_time]);

  return (
    <Card
      className={`border rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-amber-300 flex flex-col justify-between
        ${
          viewMode === "grid" ? "p-6 h-full" : "p-5 flex-row items-center gap-4"
        }`}
    >
      {viewMode === "grid" ? (
        // Grid View
        <>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
              <p className="text-amber-600 font-medium">YC Company</p>
            </div>
            <div className="bg-amber-50 p-2 rounded-full">
              <Building className="text-amber-500 h-5 w-5" />
            </div>
          </div>

          <div className="space-y-3 mb-4 flex-grow">
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2 text-amber-500" />
              <span>Posted by: {job.jobPoster}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 text-amber-500" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 text-amber-500" />
              <span>Remote/On-site</span>
            </div>
          </div>

          <Button
            className="w-full bg-amber-500 hover:bg-amber-600 text-white transition-colors duration-200 mt-auto"
            onClick={() => window.open(job.ApplyUrl, "_blank")}
          >
            Apply Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </>
      ) : (
        // List View
        <>
          <div className="flex-grow flex items-center gap-4">
            <div className="bg-amber-50 p-3 rounded-full hidden sm:block">
              <Building className="text-amber-500 h-6 w-6" />
            </div>

            <div className="flex-grow">
              <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
              <div className="flex flex-wrap gap-3 mt-1.5">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-3.5 w-3.5 mr-1 text-amber-500" />
                  <span>{job.jobPoster}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-3.5 w-3.5 mr-1 text-amber-500" />
                  <span>{formattedDate}</span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 rounded-full text-xs"
                >
                  Remote
                </Badge>
              </div>
            </div>
          </div>

          <Button
            className="bg-amber-500 hover:bg-amber-600 text-white transition-colors duration-200 whitespace-nowrap shrink-0"
            onClick={() => window.open(job.ApplyUrl, "_blank")}
          >
            Apply <ArrowRight className="ml-1 h-4 w-4 hidden sm:inline" />
          </Button>
        </>
      )}
    </Card>
  );
};

export const JobDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/dashboard/jobs"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }
        const data = await response.json();
        setJobs(data.jobs);
        setFilteredJobs(data.jobs);
        toast.success("Jobs loaded successfully!");
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load jobs");

        // Use sample data if API fails
        const sampleJobs = [
          {
            id: 10,
            jobid: 43375123,
            jobPoster: "ankerbachryhl",
            title: "Parahelp (YC S24) Is Hiring Founding Engineers (SF)",
            date_time: "2025-03-15T21:00:44.000Z",
            ApplyUrl:
              "https://www.ycombinator.com/companies/parahelp/jobs/PhUMEwg-founding-ai-engineer",
          },
          {
            id: 7,
            jobid: 43373728,
            jobPoster: "edreichua",
            title: "Stellar Sleep (YC S23) Is Hiring",
            date_time: "2025-03-15T17:00:12.000Z",
            ApplyUrl:
              "https://www.ycombinator.com/companies/stellar-sleep/jobs/Yb9IzAW-founding-product-engineer",
          },
        ];

        setJobs(sampleJobs);
        setFilteredJobs(sampleJobs);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    // Apply filters whenever search term or active tab changes
    let results = [...jobs];

    // Apply search filter
    if (searchTerm) {
      results = results.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.jobPoster.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply tab filter
    if (activeTab === "featured") {
      // For demo purposes, let's assume first job is featured
      results = results.filter((job) => job.id === 10);
    } else if (activeTab === "remote") {
      // For demo, all jobs are remote
      // No additional filtering needed
    }

    setFilteredJobs(results);

    if (results.length === 0 && searchTerm) {
      toast.info("No jobs match your search criteria");
    }
  }, [searchTerm, activeTab, jobs]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
      <div className="mb-8 bg-gradient-to-r from-amber-50 to-white p-6 rounded-xl">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Job Dashboard</h1>
        <p className="text-gray-600">
          Browse through our curated list of tech jobs that match your skills
          and preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="relative w-full md:w-2/3">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            className="pl-10 w-full border rounded-md"
            placeholder="Search jobs, skills, or companies..."
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-gray-100 transition-colors duration-200"
          >
            <SlidersHorizontal size={18} />
            Filters
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-gray-100 transition-colors duration-200"
          >
            <Bookmark size={18} />
            Saved
          </Button>
          <div className="flex border rounded-md">
            <Button
              variant="ghost"
              className={`px-3 ${
                viewMode === "grid" ? "bg-gray-100" : ""
              } transition-colors duration-200`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid size={18} />
            </Button>
            <Button
              variant="ghost"
              className={`px-3 ${
                viewMode === "list" ? "bg-gray-100" : ""
              } transition-colors duration-200`}
              onClick={() => setViewMode("list")}
            >
              <List size={18} />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8" onValueChange={handleTabChange}>
        <TabsList className="bg-gray-100">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-white data-[state=active]:text-amber-500"
          >
            All Jobs
          </TabsTrigger>
          <TabsTrigger
            value="featured"
            className="data-[state=active]:bg-white data-[state=active]:text-amber-500"
          >
            Featured
          </TabsTrigger>
          <TabsTrigger
            value="remote"
            className="data-[state=active]:bg-white data-[state=active]:text-amber-500"
          >
            Remote
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div
          className={`grid grid-cols-1 ${
            viewMode === "grid"
              ? "md:grid-cols-2 lg:grid-cols-3"
              : "md:grid-cols-1"
          } gap-6`}
        >
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card
              key={`skeleton-${item}`}
              className="p-6 h-[250px] animate-pulse"
            >
              <Skeleton className="h-8 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/3 mb-4" />
              <div className="space-y-3 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-10 w-full mt-auto" />
            </Card>
          ))}
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 ${
            viewMode === "grid"
              ? "md:grid-cols-2 lg:grid-cols-3"
              : "md:grid-cols-1"
          } gap-6 animate-fade-in`}
        >
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} viewMode={viewMode} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-500">
                No jobs found matching your criteria.
              </p>
              <Button
                variant="outline"
                className="mt-4 hover:bg-amber-50 hover:text-amber-600 transition-colors duration-200"
                onClick={() => {
                  setFilteredJobs(jobs);
                  setActiveTab("all");
                  setSearchTerm("");
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
