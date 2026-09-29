"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function StudentDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [profile, setProfile] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/users/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        if (data.length > 0) {
          setSelectedStudentId(data[0].id);
        }
      })
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  useEffect(() => {
    if (!selectedStudentId) return;
    
    setLoading(true);
    const fetchProfile = fetch(`http://localhost:8000/api/profiles/${selectedStudentId}`).then(r => r.json());
    const fetchMatches = fetch(`http://localhost:8000/api/students/${selectedStudentId}/matches`).then(r => r.json());

    Promise.all([fetchProfile, fetchMatches]).then(([profileData, matchData]) => {
      setProfile(profileData);
      setMatches(matchData.job_matches || []);
      setLoading(false);
    });
  }, [selectedStudentId]);

  return (
    <div className="min-h-screen bg-neu-bg p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header / Demo Switcher */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neu-fg">Student Portal</h1>
            <p className="text-lg text-neu-muted mt-2 font-medium">Discover internships matched to your unique skills.</p>
          </div>
          
          <div className="shadow-neu-inset-deep rounded-2xl p-3 flex items-center bg-neu-bg">
            <span className="text-xs text-neu-muted mr-3 uppercase font-bold tracking-wider">Demo User:</span>
            <select 
              className="text-sm border-none bg-transparent outline-none cursor-pointer font-bold text-neu-fg appearance-none pr-4"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
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
                      <Badge variant="default">Python</Badge>
                      <Badge variant="default">React</Badge>
                      <Badge variant="default">Data Analysis</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: AI Job Matches */}
            <div className="lg:col-span-8">
              <Tabs defaultValue="matches" className="w-full">
                <TabsList className="mb-8 w-full flex overflow-x-auto justify-start md:justify-center p-3 h-auto">
                  <TabsTrigger value="matches" className="text-base">AI Recommended Internships</TabsTrigger>
                  <TabsTrigger value="learning" className="text-base">Learning Hub</TabsTrigger>
                  <TabsTrigger value="applications" className="text-base">My Applications</TabsTrigger>
                </TabsList>
                
                <TabsContent value="matches" className="space-y-8">
                  {matches.map((job) => {
                    const matchPercent = Math.round(job.match_score * 100);
                    const isHighMatch = matchPercent > 80;
                    
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
                          <p className="text-base text-neu-muted line-clamp-2 mb-8 leading-relaxed">
                            {job.description}
                          </p>
                          <Button variant="default" size="lg">Apply Now</Button>
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
                  <CourseHub />
                </TabsContent>
                
                <TabsContent value="applications">
                  <div className="text-center p-16 rounded-[32px] shadow-neu-inset-deep text-neu-muted font-bold text-lg">
                    You haven't applied to any roles yet.
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}

function CourseHub() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/courses")
      .then(r => r.json())
      .then(data => setCourses(data));
  }, []);

  return (
    <div className="space-y-8">
      {courses.map(course => (
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
            <Button variant="outline" size="lg">
              Enroll to close skill gap
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
