import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-center p-8">
      <div className="absolute top-8 text-slate-400 font-mono text-sm border border-slate-700 px-4 py-1 rounded-full">
        Hackathon MVP
      </div>
      <h1 className="text-6xl font-extrabold tracking-tight text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
        Antigravity 2.0
      </h1>
      <p className="text-xl text-slate-300 max-w-3xl mb-16 leading-relaxed">
        The ultimate Academia-Industry Collaboration platform. Connecting skills to learning, and opportunities to placements.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* Student Portal */}
        <Link href="/student" className="group">
          <div className="h-full bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-blue-500 rounded-xl p-8 transition-all flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400">Student Portal</h2>
            <p className="text-slate-400">Discover AI-matched internships and build your learning path.</p>
          </div>
        </Link>
        
        {/* Recruiter Dashboard */}
        <Link href="/recruiter" className="group">
          <div className="h-full bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-emerald-500 rounded-xl p-8 transition-all flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400">Recruiter Dashboard</h2>
            <p className="text-slate-400">Post jobs and instantly shortlist candidates using vector similarity.</p>
          </div>
        </Link>

        {/* Academician Portal */}
        <Link href="/academician" className="group">
          <div className="h-full bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-amber-500 rounded-xl p-8 transition-all flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-400">Academician Portal</h2>
            <p className="text-slate-400">Engage in live projects, mentorships, and FDPs.</p>
          </div>
        </Link>

        {/* Institution Dashboard */}
        <Link href="/institution" className="group">
          <div className="h-full bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-purple-500 rounded-xl p-8 transition-all flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400">Institution Dashboard</h2>
            <p className="text-slate-400">Monitor skill gaps, placement funnels, and industry trends.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
