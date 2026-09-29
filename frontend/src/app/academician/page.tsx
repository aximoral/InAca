"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AcademicianDashboard() {
  const [academicians, setAcademicians] = useState<any[]>([]);
  const [selectedAcad, setSelectedAcad] = useState<string>("");
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/users/academicians")
      .then((res) => res.json())
      .then((data) => {
        setAcademicians(data);
        if (data.length > 0) setSelectedAcad(data[0].id);
      });
      
    fetch("http://localhost:8000/api/projects")
      .then((res) => res.json())
      .then(data => setProjects(data));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Academician Portal</h1>
            <p className="text-slate-500">Discover FDPs, consult on live projects, and endorse student skills.</p>
          </div>
          
          <div className="bg-white p-2 rounded-md shadow-sm border border-slate-200">
            <span className="text-xs text-slate-500 mr-2 uppercase font-semibold">Demo User:</span>
            <select 
              className="text-sm border-none bg-transparent outline-none cursor-pointer font-medium"
              value={selectedAcad}
              onChange={(e) => setSelectedAcad(e.target.value)}
            >
              {academicians.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900">Industry-Academia Collaboration</h2>
            
            {projects.filter(p => p.type === 'LIVE_PROJECT').map(project => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription>{project.sponsor}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Live Project</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">{project.description}</p>
                  <button className="text-sm font-medium text-amber-600 hover:text-amber-800">
                    Apply as Consultant &rarr;
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-slate-900">Faculty Development Programs (FDPs)</h2>
            
            {projects.filter(p => p.type === 'FDP').map(project => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <CardDescription>{project.sponsor}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">FDP</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">{project.description}</p>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    Register for FDP &rarr;
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
}
