"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AcademicianDashboard() {
  const [academicians, setAcademicians] = useState<any[]>([]);
  const [selectedAcad, setSelectedAcad] = useState<string>("");
  const [projects, setProjects] = useState<any[]>([]);
  const [collaborations, setCollaborations] = useState<any[]>([]);
  const [appliedProjects, setAppliedProjects] = useState<Set<string>>(new Set());
  
  // Research Proposal State
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDesc, setProposalDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const fetchDashboardData = () => {
    fetch("http://localhost:8000/api/projects")
      .then((res) => res.json())
      .then(data => setProjects(data));
      
    if (selectedAcad) {
      fetch(`http://localhost:8000/api/academicians/${selectedAcad}/collaborations`)
        .then((res) => res.json())
        .then(data => {
            setCollaborations(data);
            setAppliedProjects(new Set(data.map((d: any) => d.id)));
        });
    }
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/users/academicians")
      .then((res) => res.json())
      .then((data) => {
        setAcademicians(data);
        if (data.length > 0) setSelectedAcad(data[0].id);
      });
  }, []);

  useEffect(() => {
    if (selectedAcad) {
        fetchDashboardData();
    }
  }, [selectedAcad]);

  const handleApply = async (projectId: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/projects/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ academician_id: selectedAcad, project_id: projectId })
      });
      if (res.ok) {
        setAppliedProjects(prev => new Set(prev).add(projectId));
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Failed to apply", err);
    }
  };

  const handlePostProposal = async () => {
    if (!proposalTitle || !proposalDesc) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:8000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            title: proposalTitle, 
            description: proposalDesc, 
            type: "RESEARCH_PROPOSAL", 
            sponsor_id: selectedAcad 
        })
      });
      if (res.ok) {
        setProposalTitle("");
        setProposalDesc("");
        setIsModalOpen(false);
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Failed to post proposal", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neu-bg p-8 relative">
      
      {/* Dialog MUST be at root level of main component tree */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-neu-bg border-none shadow-neu-extruded rounded-[32px] sm:max-w-md p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-neu-fg">New Research Proposal 🔬</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div>
              <label className="block text-sm font-bold text-neu-muted mb-2 uppercase tracking-wider">Proposal Title</label>
              <input 
                value={proposalTitle}
                onChange={e => setProposalTitle(e.target.value)}
                className="w-full bg-neu-bg shadow-neu-inset rounded-2xl p-4 text-neu-fg outline-none focus-ring" 
                placeholder="e.g. AI-driven Supply Chain Optimization" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-neu-muted mb-2 uppercase tracking-wider">Abstract / Description</label>
              <textarea 
                value={proposalDesc}
                onChange={e => setProposalDesc(e.target.value)}
                className="w-full h-32 bg-neu-bg shadow-neu-inset rounded-2xl p-4 text-neu-fg outline-none focus-ring resize-none" 
                placeholder="Describe the research goals and desired industry outcome..."
              />
            </div>
            <Button onClick={handlePostProposal} disabled={isSubmitting || !proposalTitle || !proposalDesc} className="w-full text-lg h-14 rounded-2xl">
              {isSubmitting ? "Posting..." : "Post Proposal"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>


      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neu-fg">Academician Portal</h1>
            <p className="text-lg text-neu-muted mt-2 font-medium">Discover FDPs, consult on live projects, and post research proposals.</p>
          </div>
          
          <div className="flex items-center gap-4">
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
            <Button variant="outline" onClick={handleLogout} className="shadow-neu-extruded hover:shadow-neu-hover hover:-translate-y-1">Logout</Button>
          </div>
        </div>

        <Tabs defaultValue="explore" className="w-full">
            <div className="flex justify-between items-center mb-8">
                <TabsList className="bg-neu-bg shadow-neu-inset-deep p-2 h-auto rounded-3xl gap-2">
                    <TabsTrigger value="explore" className="rounded-2xl px-8 py-3 text-base font-bold data-[state=active]:shadow-neu-extruded data-[state=active]:bg-neu-bg">Explore Opportunities</TabsTrigger>
                    <TabsTrigger value="collaborations" className="rounded-2xl px-8 py-3 text-base font-bold data-[state=active]:shadow-neu-extruded data-[state=active]:bg-neu-bg">My Collaborations</TabsTrigger>
                </TabsList>
                
                <Button onClick={() => setIsModalOpen(true)} className="shadow-neu-extruded hover:-translate-y-1 rounded-2xl px-6 py-6 text-base bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700">
                    + New Research Proposal 🔬
                </Button>
            </div>

            <TabsContent value="explore">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Left Column: Live Projects */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4 px-2">
                    <div className="w-12 h-12 rounded-full shadow-neu-inset flex items-center justify-center text-xl">
                        💼
                    </div>
                    <h2 className="text-2xl font-bold text-neu-fg">Industry Collaboration</h2>
                    </div>
                    
                    <div className="space-y-8 p-8 shadow-neu-inset rounded-[40px]">
                    {projects.filter(p => p.type === 'LIVE_PROJECT').map(project => {
                        const isApplied = appliedProjects.has(project.id);
                        return (
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
                            <Button 
                                onClick={() => handleApply(project.id)} 
                                disabled={isApplied}
                                variant={isApplied ? "outline" : "default"}
                                className={isApplied ? "bg-neu-accent text-white shadow-neu-inset pointer-events-none" : ""}
                            >
                                {isApplied ? "Applied ✓" : "Apply as Consultant"}
                            </Button>
                        </CardContent>
                        </Card>
                    )})}
                    
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
                    {projects.filter(p => p.type === 'FDP').map(project => {
                        const isApplied = appliedProjects.has(project.id);
                        return (
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
                            <Button 
                                onClick={() => handleApply(project.id)} 
                                disabled={isApplied}
                                variant={isApplied ? "outline" : "default"}
                                className={isApplied ? "bg-neu-accent text-white shadow-neu-inset pointer-events-none" : ""}
                            >
                                {isApplied ? "Registered ✓" : "Register for FDP 📚"}
                            </Button>
                        </CardContent>
                        </Card>
                    )})}

                    {projects.filter(p => p.type === 'FDP').length === 0 && (
                        <div className="text-center p-8 text-neu-muted font-bold">No active FDPs.</div>
                    )}
                    </div>
                </div>
                
                </div>
            </TabsContent>

            <TabsContent value="collaborations">
                <div className="p-8 shadow-neu-inset rounded-[40px] space-y-8">
                    {collaborations.length > 0 ? (
                        collaborations.map(collab => (
                            <Card key={collab.id} className="border-none shadow-neu-extruded">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl mb-1">{collab.title}</CardTitle>
                                            <CardDescription className="text-base font-bold text-neu-muted">{collab.sponsor}</CardDescription>
                                        </div>
                                        <Badge variant="outline" className="text-neu-accent border-neu-accent shadow-neu-inset-small">
                                            {collab.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-neu-muted">{collab.description}</p>
                                    <div className="mt-4">
                                        <Badge className="bg-neu-bg text-neu-fg shadow-neu-inset border-none">
                                            {collab.type.replace("_", " ")}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center p-16 text-neu-muted font-bold text-lg">
                            You haven't applied to any collaborations or posted any proposals yet.
                        </div>
                    )}
                </div>
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
