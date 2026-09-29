"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";

export default function InstitutionDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/analytics/institution")
      .then(r => r.json())
      .then(data => setAnalytics(data));
  }, []);

  if (!analytics) {
    return <div className="p-12 text-center text-neu-muted font-bold animate-pulse text-lg">Loading Analytics Data...</div>;
  }

  return (
    <div className="min-h-screen bg-neu-bg p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neu-fg">Institution Analytics</h1>
            <p className="text-lg text-neu-muted mt-2 font-medium">Monitor student placement readiness and industry skill demands.</p>
          </div>
        </div>

        {/* Funnel Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="flex flex-col items-center text-center p-6">
            <CardHeader className="pb-4 items-center">
              <div className="w-16 h-16 rounded-full shadow-neu-inset-deep flex items-center justify-center mb-2">
                 <div className="w-8 h-8 rounded-full shadow-neu-extruded bg-neu-fg" />
              </div>
              <CardDescription className="text-lg uppercase tracking-wider font-bold">Total Applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-black text-neu-fg">{analytics.funnel.applied}</div>
            </CardContent>
          </Card>
          
          <Card className="flex flex-col items-center text-center p-6">
            <CardHeader className="pb-4 items-center">
              <div className="w-16 h-16 rounded-full shadow-neu-inset-deep flex items-center justify-center mb-2">
                 <div className="w-8 h-8 rounded-full shadow-neu-extruded bg-blue-500" />
              </div>
              <CardDescription className="text-lg uppercase tracking-wider font-bold">Shortlisted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-black text-blue-500">{analytics.funnel.shortlisted}</div>
            </CardContent>
          </Card>

          <Card className="flex flex-col items-center text-center p-6">
            <CardHeader className="pb-4 items-center">
              <div className="w-16 h-16 rounded-full shadow-neu-inset-deep flex items-center justify-center mb-2">
                 <div className="w-8 h-8 rounded-full shadow-neu-extruded bg-neu-success" />
              </div>
              <CardDescription className="text-lg uppercase tracking-wider font-bold">Final Placements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-black text-neu-success">{analytics.funnel.hired}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div className="p-8 shadow-neu-inset rounded-[40px] flex flex-col">
            <div className="mb-8 px-4">
              <h2 className="text-2xl font-bold text-neu-fg">Skill Demand Trends</h2>
              <p className="text-neu-muted font-medium mt-1">Most requested competencies by industry recruiters this quarter</p>
            </div>
            
            <div className="flex-1 min-h-[350px] shadow-neu-extruded rounded-[32px] p-6 bg-neu-bg">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.skills} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#a3b1c6" opacity={0.3} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#3D4852', fontWeight: 600}} />
                  <Tooltip cursor={{fill: 'rgba(163,177,198,0.1)'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '9px 9px 16px rgba(163, 177, 198, 0.6)', backgroundColor: '#E0E5EC', color: '#3D4852', fontWeight: 'bold'}} />
                  <Bar dataKey="demand" fill="#6C63FF" radius={[0, 8, 8, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-8 shadow-neu-inset rounded-[40px] flex flex-col">
            <div className="mb-8 px-4">
              <h2 className="text-2xl font-bold text-neu-fg">Cohort Placement Readiness</h2>
              <p className="text-neu-muted font-medium mt-1">Average matching score index across graduating classes</p>
            </div>
            
            <div className="flex-1 min-h-[350px] shadow-neu-extruded rounded-[32px] p-6 bg-neu-bg">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.readiness} margin={{ top: 30, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#a3b1c6" opacity={0.3} />
                  <XAxis dataKey="cohort" axisLine={false} tickLine={false} dy={15} tick={{fill: '#3D4852', fontWeight: 600}} />
                  <YAxis axisLine={false} tickLine={false} dx={-10} domain={[0, 100]} tick={{fill: '#3D4852', fontWeight: 600}} />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '9px 9px 16px rgba(163, 177, 198, 0.6)', backgroundColor: '#E0E5EC', color: '#3D4852', fontWeight: 'bold'}} />
                  <Line type="monotone" dataKey="score" stroke="#38B2AC" strokeWidth={4} dot={{r: 8, fill: '#E0E5EC', strokeWidth: 3}} activeDot={{r: 10, fill: '#38B2AC'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
