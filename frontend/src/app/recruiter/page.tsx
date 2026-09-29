"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function RecruiterDashboard() {
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [selectedRecruiterId, setSelectedRecruiterId] = useState<string>("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [matches, setMatches] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

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
        else { setSelectedJobId(""); setMatches([]); }
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
  }, [selectedJobId]);

  return (
    <div className="min-h-screen bg-neu-bg p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header / Demo Switcher */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neu-fg">Recruiter Dashboard</h1>
            <p className="text-lg text-neu-muted mt-2 font-medium">Manage postings and discover top-matched candidates instantly.</p>
          </div>
          
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

          {/* Right Column: AI Matches */}
          <div className="lg:col-span-7">
            <Card className="min-h-[600px] flex flex-col overflow-hidden">
              <CardHeader className="bg-neu-bg shadow-neu-extruded-small z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full shadow-neu-inset flex items-center justify-center text-xl">
                     ✨
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
                            <Button variant="outline" size="sm">View Profile</Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}
