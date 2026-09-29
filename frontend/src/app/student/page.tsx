"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StudentDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [profile, setProfile] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch available students for the demo dropdown
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

  // 2. Fetch profile and matches when a student is selected
  useEffect(() => {
    if (!selectedStudentId) return;
    
    setLoading(true);
    
    // Fetch Profile
    const fetchProfile = fetch(`http://localhost:8000/api/profiles/${selectedStudentId}`).then(r => r.json());
    
    // Fetch AI Matches
    const fetchMatches = fetch(`http://localhost:8000/api/students/${selectedStudentId}/matches`).then(r => r.json());

    Promise.all([fetchProfile, fetchMatches]).then(([profileData, matchData]) => {
      setProfile(profileData);
      setMatches(matchData.job_matches || []);
      setLoading(false);
    });
  }, [selectedStudentId]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header / Demo Switcher */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Student Portal</h1>
            <p className="text-slate-500">Discover internships matched to your unique skills.</p>
          </div>
          
          <div className="bg-white p-2 rounded-md shadow-sm border border-slate-200">
            <span className="text-xs text-slate-500 mr-2 uppercase font-semibold">Demo User:</span>
            <select 
              className="text-sm border-none bg-transparent outline-none cursor-pointer font-medium"
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
              <div className="h-2 bg-slate-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left Column: Profile View */}
            <div className="md:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-4">
                    {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                  </div>
                  <CardTitle>{profile?.first_name} {profile?.last_name}</CardTitle>
                  <CardDescription>{profile?.organization_name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 italic">"{profile?.bio}"</p>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold mb-2 text-slate-900">Verified Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Python</Badge>
                      <Badge variant="secondary">React</Badge>
                      <Badge variant="secondary">Data Analysis</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: AI Job Matches */}
            <div className="md:col-span-2">
              <Tabs defaultValue="matches" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="matches">AI Recommended Internships</TabsTrigger>
                  <TabsTrigger value="learning">Learning Hub</TabsTrigger>
                  <TabsTrigger value="applications">My Applications</TabsTrigger>
                </TabsList>
                
                <TabsContent value="matches" className="space-y-4">
                  {matches.map((job) => {
                    const matchPercent = Math.round(job.match_score * 100);
                    return (
                      <Card key={job.job_id} className="border-slate-200 hover:border-blue-300 transition-colors">
                        <CardHeader className="flex flex-row justify-between items-start pb-2">
                          <div>
                            <CardTitle className="text-lg text-slate-900">{job.title}</CardTitle>
                            <CardDescription className="font-medium text-slate-600">{job.company}</CardDescription>
                          </div>
                          
                          <div className="flex flex-col items-end">
                            <Badge className={matchPercent > 80 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                              {matchPercent}% Match
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                            {job.description}
                          </p>
                          <button className="bg-slate-900 text-white text-sm px-4 py-2 rounded-md hover:bg-slate-800 transition-colors">
                            Apply Now
                          </button>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  {matches.length === 0 && (
                    <div className="text-center p-8 bg-white border border-slate-200 rounded-lg">
                      <p className="text-slate-500">No matching jobs found right now.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="learning" className="space-y-4">
                  <CourseHub />
                </TabsContent>
                
                <TabsContent value="applications">
                  <Card>
                    <CardContent className="p-8 text-center text-slate-500">
                      You haven't applied to any roles yet.
                    </CardContent>
                  </Card>
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
    <div className="space-y-4">
      {courses.map(course => (
        <Card key={course.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg text-slate-900">{course.title}</CardTitle>
                <CardDescription className="font-medium text-indigo-600">{course.provider}</CardDescription>
              </div>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Recommended</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">{course.description}</p>
            <button className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              Enroll to close skill gap
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
