"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [profile, setProfile] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Dynamic States
  const [skills, setSkills] = useState<string[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  
  // Interactive States
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("matches");

  useEffect(() => {
    // Read from Auth state
    const userId = localStorage.getItem("user_id");
    const role = localStorage.getItem("role");
    
    if (!userId || role !== "STUDENT") {
       router.push("/");
       return;
    }
    
    setSelectedStudentId(userId);
  }, [router]);

  useEffect(() => {
    if (!selectedStudentId) return;
    
    setLoading(true);
    const fetchProfile = fetch(`http://localhost:8000/api/profiles/${selectedStudentId}`).then(r => r.json());
    const fetchMatches = fetch(`http://localhost:8000/api/students/${selectedStudentId}/matches`).then(r => r.json());
    const fetchSkills = fetch(`http://localhost:8000/api/students/${selectedStudentId}/skills`).then(r => r.json());
    const fetchApps = fetch(`http://localhost:8000/api/students/${selectedStudentId}/applications`).then(r => r.json());

    Promise.all([fetchProfile, fetchMatches, fetchSkills, fetchApps]).then(([profileData, matchData, skillsData, appsData]) => {
      setProfile(profileData);
      setMatches(matchData.job_matches || []);
      setSkills(skillsData || []);
      setApplications(appsData || []);
      
      const appliedSet = new Set<string>();
      (appsData || []).forEach((app: any) => {
        // Mocking local tracking since ID wasn't explicitly returned for jobs in the app payload yet
      });
      setLoading(false);
    }).catch(err => {
      console.error("Error loading dashboard data", err);
      setLoading(false);
    });
  }, [selectedStudentId]);

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    router.push("/");
  };

  const handleApply = async (jobId: string) => {
    if (!selectedStudentId) return;
    setApplyingJobId(jobId);
    try {
      const res = await fetch("http://localhost:8000/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: selectedStudentId, job_id: jobId })
      });
      if (res.ok) {
        setAppliedJobs(prev => new Set(prev).add(jobId));
        // Optionally refresh applications tab
        const appsRes = await fetch(`http://localhost:8000/api/students/${selectedStudentId}/applications`);
        const appsData = await appsRes.json();
        setApplications(appsData || []);
      }
    } catch (err) {
      console.error("Failed to apply", err);
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div className="min-h-screen bg-neu-bg p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header / Demo Switcher */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neu-fg">Student Portal</h1>
            <p className="text-lg text-neu-muted mt-2 font-medium">Discover internships matched to your unique skills.</p>
          </div>
          
          <div className="flex items-center gap-4">
            {profile?.first_name ? (
              <Button variant="default" onClick={() => window.location.href='/profile'}>My Profile 👤</Button>
            ) : (
              <Button variant="default" onClick={() => window.location.href='/onboarding'}>Complete Profile ✨</Button>
            )}
            <Button variant="outline" onClick={handleLogout} className="shadow-neu-extruded hover:shadow-neu-hover hover:-translate-y-1">Logout</Button>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-300 rounded opacity-50"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-300 rounded col-span-2 opacity-50"></div>
                  <div className="h-2 bg-slate-300 rounded col-span-1 opacity-50"></div>
                </div>
                <div className="h-2 bg-slate-300 rounded opacity-50"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Profile View */}
            <div className="lg:col-span-4 space-y-8">
              <Card>
                <CardHeader className="items-center text-center">
                  <div className="w-24 h-24 rounded-full shadow-neu-inset-deep flex items-center justify-center mb-6">
                     <div className="w-20 h-20 bg-neu-bg rounded-full shadow-neu-extruded flex items-center justify-center text-2xl font-bold text-neu-accent">
                        {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                     </div>
                  </div>
                  <CardTitle className="text-2xl">{profile?.first_name} {profile?.last_name}</CardTitle>
                  <CardDescription className="text-base">{profile?.organization_name}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-neu-muted italic font-medium">"{profile?.bio}"</p>
                  
                  <div className="mt-8">
                    <h4 className="text-sm font-bold mb-4 text-neu-fg uppercase tracking-wider">Verified Skills</h4>
                    <div className="flex flex-wrap justify-center gap-3">
                      {skills.length > 0 ? (
                        skills.map((skill, i) => (
                          <Badge key={i} variant="default">{skill}</Badge>
                        ))
                      ) : (
                        <span className="text-neu-muted text-sm italic">No skills added yet. Complete your profile!</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: AI Job Matches */}
            <div className="lg:col-span-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-8 w-full flex overflow-x-auto justify-start md:justify-center p-3 h-auto">
                  <TabsTrigger value="matches" className="text-base">AI Recommended Internships</TabsTrigger>
                  <TabsTrigger value="learning" className="text-base">Learning Hub</TabsTrigger>
                  <TabsTrigger value="applications" className="text-base">My Applications</TabsTrigger>
                </TabsList>
                
                <TabsContent value="matches" className="space-y-8">
                  {matches.map((job) => {
                    const matchPercent = Math.round(job.match_score * 100);
                    const isHighMatch = matchPercent > 80;
                    const hasApplied = appliedJobs.has(job.job_id);
                    
                    return (
                      <Card key={job.job_id}>
                        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center pb-4 gap-4">
                          <div>
                            <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                            <CardDescription className="text-base">{job.company}</CardDescription>
                          </div>
                          <Badge variant="secondary" className={isHighMatch ? "text-neu-success shadow-neu-inset-small" : ""}>
                            {matchPercent}% Match
                          </Badge>
                        </CardHeader>
                        <CardContent>
                          <p className="text-base text-neu-muted line-clamp-2 mb-6 leading-relaxed">
                            {job.description}
                          </p>

                          {job.missing_skills && job.missing_skills.length > 0 && (
                            <div className="mb-8 p-4 rounded-[20px] bg-red-500/5 border border-red-500/10 shadow-neu-inset-deep">
                              <div className="flex justify-between items-center mb-3">
                                <h4 className="text-sm font-bold text-red-500/80 uppercase tracking-wider">Skill Gap Identified</h4>
                                <Button variant="ghost" size="sm" onClick={() => setActiveTab("learning")} className="h-6 text-xs font-bold text-neu-accent hover:text-neu-accent/80 p-0 hover:bg-transparent">Close the Gap ↗</Button>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {job.missing_skills.map((skill: string, i: number) => (
                                  <Badge key={i} variant="outline" className="border-red-500/30 text-red-500/80 bg-red-500/5">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          <Button 
                            variant="default" 
                            size="lg"
                            disabled={hasApplied || applyingJobId === job.job_id}
                            onClick={() => handleApply(job.job_id)}
                            className={hasApplied ? "bg-neu-success text-white shadow-neu-inset" : ""}
                          >
                            {applyingJobId === job.job_id ? "Applying..." : hasApplied ? "Applied ✅" : "Apply Now"}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {matches.length === 0 && (
                    <div className="text-center p-12 bg-neu-bg rounded-[32px] shadow-neu-inset-deep">
                      <p className="text-neu-muted font-bold text-lg">No matching jobs found right now.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="learning" className="space-y-8">
                  <CourseHub studentId={selectedStudentId} />
                </TabsContent>
                
                <TabsContent value="applications">
                  {applications.length > 0 ? (
                    <div className="space-y-6">
                      {applications.map((app) => (
                        <div key={app.id} className="flex justify-between items-center p-6 bg-neu-bg shadow-neu-extruded rounded-[24px]">
                          <div>
                            <h4 className="font-bold text-lg text-neu-fg">{app.title}</h4>
                            <p className="text-neu-muted text-sm">{app.company}</p>
                          </div>
                          <Badge variant="secondary" className="bg-amber-100 text-amber-700 shadow-neu-inset-small">
                            {app.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-16 rounded-[32px] shadow-neu-inset-deep text-neu-muted font-bold text-lg">
                      You haven't applied to any roles yet.
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}

function CourseHub({ studentId }: { studentId: string }) {
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("http://localhost:8000/api/courses")
      .then(r => r.json())
      .then(data => setCourses(data));
  }, []);

  const handleEnroll = async (courseId: string) => {
    if (!studentId) return;
    setEnrollingId(courseId);
    try {
      const res = await fetch("http://localhost:8000/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, course_id: courseId })
      });
      if (res.ok) {
        setEnrolledCourses(prev => new Set(prev).add(courseId));
      }
    } catch (err) {
      console.error("Failed to enroll", err);
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {courses.map(course => {
        const isEnrolled = enrolledCourses.has(course.id);
        
        return (
          <Card key={course.id}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-xl mb-1">{course.title}</CardTitle>
                  <CardDescription className="text-base font-bold text-neu-accent">{course.provider}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-base text-neu-muted mb-8 leading-relaxed">{course.description}</p>
              <a 
                href={course.url || "#"} 
                target={course.url ? "_blank" : undefined} 
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!course.url || isEnrolled || enrollingId === course.id) {
                    e.preventDefault();
                  }
                }}
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  disabled={isEnrolled || enrollingId === course.id}
                  onClick={(e) => {
                    // Prevent default to avoid navigation if already enrolled/enrolling
                    if (isEnrolled || enrollingId === course.id) {
                      e.preventDefault();
                      return;
                    }
                    handleEnroll(course.id);
                  }}
                  className={isEnrolled ? "bg-neu-accent text-white shadow-neu-inset pointer-events-none" : ""}
                >
                  {enrollingId === course.id ? "Enrolling..." : isEnrolled ? "Enrolled ✅" : "Enroll to close skill gap"}
                </Button>
              </a>
            </CardContent>
          </Card>
        )
      })}
    </div>
  );
}
