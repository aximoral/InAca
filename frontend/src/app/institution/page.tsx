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
    return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Analytics Data...</div>;
  }

  const funnelData = [
    { name: "Total Applications", value: analytics.funnel.applied },
    { name: "Shortlisted", value: analytics.funnel.shortlisted },
    { name: "Hired", value: analytics.funnel.hired },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Institution Analytics</h1>
          <p className="text-slate-500">Monitor student placement readiness and industry skill demands.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Applications</CardDescription>
              <CardTitle className="text-4xl">{analytics.funnel.applied}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Candidates Shortlisted</CardDescription>
              <CardTitle className="text-4xl text-blue-600">{analytics.funnel.shortlisted}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Final Placements</CardDescription>
              <CardTitle className="text-4xl text-green-600">{analytics.funnel.hired}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Skill Demand Trends</CardTitle>
              <CardDescription>Most requested competencies by industry recruiters this quarter</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.skills} layout="vertical" margin={{ left: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#f1f5f9'}} />
                  <Bar dataKey="demand" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Cohort Placement Readiness</CardTitle>
              <CardDescription>Average matching score index across graduating classes</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.readiness} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="cohort" axisLine={false} tickLine={false} dy={10} />
                  <YAxis axisLine={false} tickLine={false} dx={-10} domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{r: 6}} activeDot={{r: 8}} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
