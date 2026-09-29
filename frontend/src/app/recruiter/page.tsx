"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RecruiterDashboard() {
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [selectedRecruiterId, setSelectedRecruiterId] = useState<string>("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [matches, setMatches] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  // 1. Fetch available recruiters for the demo dropdown
  useEffect(() => {
    fetch("http://localhost:8000/api/users/recruiters")
      .then((res) => res.json())
      .then((data) => {
        setRecruiters(data);
        if (data.length > 0) {
          setSelectedRecruiterId(data[0].id);
        }
      })
      .catch((err) => console.error("Error fetching recruiters:", err));
  }, []);

  // 2. Fetch jobs when a recruiter is selected
  useEffect(() => {
    if (!selectedRecruiterId) return;
    
    fetch(`http://localhost:8000/api/recruiters/${selectedRecruiterId}/jobs`)
      .then(r => r.json())
      .then(data => {
        setJobs(data);
        if (data.length > 0) {
          setSelectedJobId(data[0].id); // Auto-select first job
        } else {
          setSelectedJobId("");
          setMatches([]);
        }
      });
  }, [selectedRecruiterId]);

  // 3. Fetch matching students when a job is selected
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
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header / Demo Switcher */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Recruiter Dashboard</h1>
            <p className="text-slate-500">Manage postings and discover top-matched candidates instantly.</p>
          </div>
          
          <div className="bg-white p-2 rounded-md shadow-sm border border-slate-200">
            <span className="text-xs text-slate-500 mr-2 uppercase font-semibold">Demo Recruiter:</span>
            <select 
              className="text-sm border-none bg-transparent outline-none cursor-pointer font-medium"
              value={selectedRecruiterId}
              onChange={(e) => setSelectedRecruiterId(e.target.value)}
            >
              {recruiters.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Active Jobs */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Active Postings</h2>
              <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700">
                + New Job
              </button>
            </div>

            <div className="space-y-3">
              {jobs.map(job => (
                <div 
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedJobId === job.id 
                      ? 'border-blue-500 bg-blue-50 shadow-sm' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-900">{job.title}</h3>
                    {job.is_active && <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">{job.description}</p>
                </div>
              ))}
              
              {jobs.length === 0 && (
                <div className="text-center p-6 bg-white border border-slate-200 rounded-lg text-slate-500">
                  No active job postings.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: AI Matches for the selected Job */}
          <div className="md:col-span-8">
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden min-h-[500px]">
              
              <div className="bg-slate-900 px-6 py-4 border-b border-slate-800">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <span className="mr-2">✨ AI Candidate Matches</span>
                  {selectedJobId && <span className="text-slate-400 font-normal text-sm border-l border-slate-700 pl-2 ml-2">For selected posting</span>}
                </h2>
              </div>

              <div className="p-6">
                {!selectedJobId ? (
                  <div className="flex items-center justify-center h-64 text-slate-400">
                    Select a job posting on the left to see matched candidates.
                  </div>
                ) : loadingMatches ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-24 bg-slate-100 rounded-lg border border-slate-100"></div>
                    ))}
                  </div>
                ) : matches.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                    <p>No candidates found matching this role's vector footprint.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {matches.map((match, idx) => {
                      const matchPercent = Math.round(match.match_score * 100);
                      
                      return (
                        <div key={match.user_id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-600">
                              {match.first_name[0]}{match.last_name[0]}
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900">{match.first_name} {match.last_name}</h4>
                              <p className="text-sm text-slate-500 line-clamp-1 max-w-md">
                                {match.bio}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <Badge className={matchPercent > 80 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                                {matchPercent}% Match
                              </Badge>
                            </div>
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 transition-colors">
                              View Profile
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
