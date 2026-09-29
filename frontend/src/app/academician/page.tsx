"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-neu-bg p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neu-fg">Academician Portal</h1>
            <p className="text-lg text-neu-muted mt-2 font-medium">Discover FDPs, consult on live projects, and endorse student skills.</p>
          </div>
          
          <div className="shadow-neu-inset-deep rounded-2xl p-3 flex items-center bg-neu-bg">
            <span className="text-xs text-neu-muted mr-3 uppercase font-bold tracking-wider">Demo User:</span>
            <select 
              className="text-sm border-none bg-transparent outline-none cursor-pointer font-bold text-neu-fg appearance-none pr-4"
              value={selectedAcad}
              onChange={(e) => setSelectedAcad(e.target.value)}
            >
              {academicians.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Live Projects */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 px-2">
               <div className="w-12 h-12 rounded-full shadow-neu-inset flex items-center justify-center text-xl">
                 🤝
               </div>
               <h2 className="text-2xl font-bold text-neu-fg">Industry Collaboration</h2>
            </div>
            
            <div className="space-y-8 p-8 shadow-neu-inset rounded-[40px]">
              {projects.filter(p => p.type === 'LIVE_PROJECT').map(project => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <CardTitle className="text-xl mb-1">{project.title}</CardTitle>
                        <CardDescription className="text-base font-bold text-neu-accent">{project.sponsor}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-amber-100 text-amber-700 shadow-neu-extruded border-none">Live Project</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-neu-muted mb-8 leading-relaxed font-medium">{project.description}</p>
                    <Button variant="default">Apply as Consultant</Button>
                  </CardContent>
                </Card>
              ))}
              
              {projects.filter(p => p.type === 'LIVE_PROJECT').length === 0 && (
                 <div className="text-center p-8 text-neu-muted font-bold">No active live projects.</div>
              )}
            </div>
          </div>

          {/* Right Column: FDPs */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 px-2">
               <div className="w-12 h-12 rounded-full shadow-neu-inset flex items-center justify-center text-xl">
                 📚
               </div>
               <h2 className="text-2xl font-bold text-neu-fg">Faculty Development Programs</h2>
            </div>
            
            <div className="space-y-8 p-8 shadow-neu-inset rounded-[40px]">
              {projects.filter(p => p.type === 'FDP').map(project => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <CardTitle className="text-xl mb-1">{project.title}</CardTitle>
                        <CardDescription className="text-base font-bold text-blue-600">{project.sponsor}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 shadow-neu-extruded border-none">FDP</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-neu-muted mb-8 leading-relaxed font-medium">{project.description}</p>
                    <Button variant="outline">Register for FDP</Button>
                  </CardContent>
                </Card>
              ))}

              {projects.filter(p => p.type === 'FDP').length === 0 && (
                 <div className="text-center p-8 text-neu-muted font-bold">No active FDPs.</div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
