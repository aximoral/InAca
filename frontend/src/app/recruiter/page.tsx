"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RecruiterDashboard() {
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [selectedRecruiterId, setSelectedRecruiterId] = useState<string>("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  
  const [matches, setMatches] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  const [viewingCandidateId, setViewingCandidateId] = useState<string | null>(null);
  const [candidateProfile, setCandidateProfile] = useState<any>(null);
  const [candidateSkills, setCandidateSkills] = useState<any[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/users/recruiters")
      .then((res) => res.json())
      .then((data) => {
        setRecruiters(data);
        if (data.length > 0) setSelectedRecruiterId(data[0].id);
      })
      .catch((err) => console.error("Error fetching recruiters:", err));
  }, []);

  useEffect(() => {
    if (!selectedRecruiterId) return;
    
    fetch(`http://localhost:8000/api/recruiters/${selectedRecruiterId}/jobs`)
      .then(r => r.json())
      .then(data => {
        setJobs(data);
        if (data.length > 0) setSelectedJobId(data[0].id);
        else { setSelectedJobId(""); setMatches([]); setApplicants([]); }
      });
  }, [selectedRecruiterId]);

  useEffect(() => {
    if (!selectedJobId) return;
    
    setLoadingMatches(true);
    fetch(`http://localhost:8000/api/jobs/${selectedJobId}/matches`)
      .then(r => r.json())
      .then(data => {
        setMatches(data.matches || []);
        setLoadingMatches(false);
      });

    setLoadingApplicants(true);
    fetch(`http://localhost:8000/api/jobs/${selectedJobId}/applicants`)
      .then(r => r.json())
      .then(data => {
        setApplicants(data);
        setLoadingApplicants(false);
      });
  }, [selectedJobId]);

  useEffect(() => {
    if (!viewingCandidateId) return;
    setLoadingProfile(true);
    Promise.all([
      fetch(`http://localhost:8000/api/profiles/${viewingCandidateId}`).then(r => r.json()),
      fetch(`http://localhost:8000/api/students/${viewingCandidateId}/skills`).then(r => r.json())
    ]).then(([profileData, skillsData]) => {
      setCandidateProfile(profileData);
      setCandidateSkills((skillsData || []).map((s: any) => s.name || s.skill_name || s));
      setLoadingProfile(false);
    });
  }, [viewingCandidateId]);

  return (
    <div className="min-h-screen bg-neu-bg p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header / Demo Switcher */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neu-fg">Recruiter Dashboard</h1>
            <p className="text-lg text-neu-muted mt-2 font-medium">Manage postings and discover top-matched candidates instantly.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="shadow-neu-inset-deep rounded-2xl p-3 flex items-center bg-neu-bg">
              <span className="text-xs text-neu-muted mr-3 uppercase font-bold tracking-wider">Demo Recruiter:</span>
              <select 
                className="text-sm border-none bg-transparent outline-none cursor-pointer font-bold text-neu-fg appearance-none pr-4"
                value={selectedRecruiterId}
                onChange={(e) => setSelectedRecruiterId(e.target.value)}
              >
                {recruiters.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <Button variant="outline" onClick={handleLogout} className="shadow-neu-extruded hover:shadow-neu-hover hover:-translate-y-1">Logout</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Active Jobs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex justify-between items-center mb-6 px-2">
              <h2 className="text-2xl font-bold text-neu-fg">Active Postings</h2>
              <Button size="sm">+ New Job</Button>
            </div>

            <div className="space-y-6">
              {jobs.map(job => (
                <div 
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={`p-6 rounded-[32px] cursor-pointer transition-all duration-300 ${
                    selectedJobId === job.id 
                      ? 'shadow-neu-inset-deep bg-neu-bg' 
                      : 'shadow-neu-extruded bg-neu-bg hover:-translate-y-1 hover:shadow-neu-hover'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h3 className="font-bold text-lg text-neu-fg">{job.title}</h3>
                    {job.is_active && <Badge variant="secondary" className="text-neu-success">Active</Badge>}
                  </div>
                  <p className="text-sm text-neu-muted line-clamp-2 leading-relaxed font-medium">{job.description}</p>
                </div>
              ))}
              
              {jobs.length === 0 && (
                <div className="text-center p-10 shadow-neu-inset-deep rounded-[32px] text-neu-muted font-bold">
                  No active job postings.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Tabs (AI Matches / Applicants) */}
          <div className="lg:col-span-7">
            <Tabs defaultValue="matches" className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList className="grid w-full max-w-md grid-cols-2 shadow-neu-extruded rounded-full p-2 bg-neu-bg">
                  <TabsTrigger value="matches" className="rounded-full data-[state=active]:shadow-neu-inset-deep data-[state=active]:bg-neu-bg data-[state=active]:text-neu-fg font-bold">AI Matches</TabsTrigger>
                  <TabsTrigger value="applicants" className="rounded-full data-[state=active]:shadow-neu-inset-deep data-[state=active]:bg-neu-bg data-[state=active]:text-neu-fg font-bold">Applicants</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="matches" className="mt-0 outline-none">
                <Card className="min-h-[600px] flex flex-col overflow-hidden">
                  <CardHeader className="bg-neu-bg shadow-neu-extruded-small z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full shadow-neu-inset flex items-center justify-center text-xl">
                         o"
                      </div>
                      <div>
                         <CardTitle className="text-2xl">AI Candidate Matches</CardTitle>
                         {selectedJobId && <CardDescription>Ranked by cosine similarity for selected posting</CardDescription>}
                      </div>
                    </div>
                  </CardHeader>

                  <div className="p-8 flex-1 bg-neu-bg shadow-neu-inset">
                    {!selectedJobId ? (
                      <div className="flex items-center justify-center h-full text-neu-muted font-bold text-lg">
                        Select a job posting on the left to see matched candidates.
                      </div>
                    ) : loadingMatches ? (
                      <div className="animate-pulse space-y-6">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-28 bg-slate-300 opacity-20 rounded-[24px]"></div>
                        ))}
                      </div>
                    ) : matches.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-neu-muted font-bold text-lg">
                        <p>No candidates found matching this role's vector footprint.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {matches.map((match) => {
                          const matchPercent = Math.round(match.match_score * 100);
                          
                          return (
                            <div key={match.user_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 shadow-neu-extruded rounded-[24px] bg-neu-bg transition-all duration-300 hover:shadow-neu-hover hover:-translate-y-1 gap-6">
                              <div className="flex items-center gap-6">
                                <div className="w-14 h-14 shrink-0 rounded-full shadow-neu-inset-deep flex items-center justify-center font-bold text-xl text-neu-accent">
                                  {match.first_name[0]}{match.last_name[0]}
                                </div>
                                <div>
                                  <h4 className="font-bold text-lg text-neu-fg mb-1">{match.first_name} {match.last_name}</h4>
                                  <p className="text-sm text-neu-muted line-clamp-2 leading-relaxed font-medium">
                                    {match.bio}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex flex-col sm:items-end gap-3 shrink-0">
                                <Badge variant={matchPercent > 80 ? "default" : "secondary"} className={matchPercent > 80 ? "bg-neu-success text-white shadow-neu-extruded" : ""}>
                                  {matchPercent}% Match
                                </Badge>
                                <Button variant="outline" size="sm" onClick={() => setViewingCandidateId(match.user_id)}>View Profile</Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="applicants" className="mt-0 outline-none">
                <Card className="min-h-[600px] flex flex-col overflow-hidden">
                  <CardHeader className="bg-neu-bg shadow-neu-extruded-small z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full shadow-neu-inset flex items-center justify-center text-xl">
                         👤
                      </div>
                      <div>
                         <CardTitle className="text-2xl">Job Applicants</CardTitle>
                         {selectedJobId && <CardDescription>Students who have officially applied</CardDescription>}
                      </div>
                    </div>
                  </CardHeader>

                  <div className="p-8 flex-1 bg-neu-bg shadow-neu-inset">
                    {!selectedJobId ? (
                      <div className="flex items-center justify-center h-full text-neu-muted font-bold text-lg">
                        Select a job posting on the left to see applicants.
                      </div>
                    ) : loadingApplicants ? (
                      <div className="animate-pulse space-y-6">
                        {[1, 2].map(i => (
                          <div key={i} className="h-28 bg-slate-300 opacity-20 rounded-[24px]"></div>
                        ))}
                      </div>
                    ) : applicants.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-neu-muted font-bold text-lg">
                        <p>No applications received for this posting yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {applicants.map((app) => (
                          <div key={app.user_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 shadow-neu-extruded rounded-[24px] bg-neu-bg transition-all duration-300 hover:shadow-neu-hover hover:-translate-y-1 gap-6">
                            <div className="flex items-center gap-6">
                              <div className="w-14 h-14 shrink-0 rounded-full shadow-neu-inset-deep flex items-center justify-center font-bold text-xl text-neu-accent">
                                {app.first_name[0]}{app.last_name[0]}
                              </div>
                              <div>
                                <h4 className="font-bold text-lg text-neu-fg mb-1">{app.first_name} {app.last_name}</h4>
                                <p className="text-sm text-neu-muted line-clamp-2 leading-relaxed font-medium">
                                  {app.bio}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:items-end gap-3 shrink-0">
                              <Badge variant="outline" className="border-neu-accent/30 text-neu-accent uppercase tracking-wider text-[10px]">
                                {app.status}
                              </Badge>
                              <Button variant="outline" size="sm" onClick={() => setViewingCandidateId(app.user_id)}>View Profile</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
        </div>
      </div>

      {viewingCandidateId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-neu-bg rounded-[32px] shadow-neu-extruded overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-white/20">
              <h2 className="text-2xl font-bold text-neu-fg">Candidate Profile</h2>
              <Button variant="ghost" onClick={() => setViewingCandidateId(null)} className="rounded-full shadow-neu-inset hover:shadow-neu-inset-deep">
                Close
              </Button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1">
              {loadingProfile ? (
                <div className="flex justify-center p-12 text-neu-muted font-bold animate-pulse">Loading Profile...</div>
              ) : candidateProfile ? (
                <div className="space-y-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-32 h-32 rounded-full shadow-neu-inset-deep flex items-center justify-center bg-neu-bg">
                      <div className="w-24 h-24 rounded-full shadow-neu-extruded flex items-center justify-center text-3xl font-black text-neu-accent">
                        {candidateProfile.first_name?.[0]}{candidateProfile.last_name?.[0]}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-extrabold text-neu-fg">{candidateProfile.first_name} {candidateProfile.last_name}</h3>
                      <p className="text-lg text-neu-muted font-medium mt-1">{candidateProfile.bio}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/20">
                    <h4 className="text-sm uppercase tracking-wider font-bold text-neu-muted mb-4 text-center">Verified Skills</h4>
                    {candidateSkills.length > 0 ? (
                      <div className="flex flex-wrap justify-center gap-3">
                        {candidateSkills.map((skill, i) => (
                          <Badge key={i} variant="default" className="px-4 py-2 text-sm shadow-neu-extruded hover:-translate-y-1 transition-transform cursor-default">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-neu-muted italic font-medium">No skills added yet.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-neu-muted">Profile not found.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
