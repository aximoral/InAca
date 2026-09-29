import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neu-bg text-center p-8 overflow-hidden relative">
      
      {/* Ambient background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full shadow-neu-extruded opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full shadow-neu-inset-deep opacity-50 pointer-events-none" />

      <div className="absolute top-8 text-neu-muted font-bold text-sm tracking-widest uppercase px-6 py-2 rounded-2xl shadow-neu-inset-small">
        Hackathon MVP
      </div>
      
      <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-neu-fg mb-6 relative z-10">
        Antigravity <span className="text-neu-accent">2.0</span>
      </h1>
      <p className="text-xl text-neu-muted max-w-3xl mb-16 leading-relaxed relative z-10 font-medium">
        The ultimate Academia-Industry Collaboration platform. Connecting skills to learning, and opportunities to placements.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl w-full relative z-10">
        {/* Student Portal */}
        <Link href="/student" className="block group">
          <div className="h-full bg-neu-bg rounded-[32px] p-10 shadow-neu-extruded transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-neu-hover active:translate-y-1 active:shadow-neu-inset flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full shadow-neu-inset-deep flex items-center justify-center mb-6">
              <div className="w-10 h-10 rounded-full shadow-neu-extruded bg-neu-accent" />
            </div>
            <h2 className="text-2xl font-bold text-neu-fg mb-3">Student Portal</h2>
            <p className="text-neu-muted font-medium">Discover AI-matched internships and build your learning path.</p>
          </div>
        </Link>
        
        {/* Recruiter Dashboard */}
        <Link href="/recruiter" className="block group">
          <div className="h-full bg-neu-bg rounded-[32px] p-10 shadow-neu-extruded transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-neu-hover active:translate-y-1 active:shadow-neu-inset flex flex-col items-center text-center">
             <div className="w-20 h-20 rounded-full shadow-neu-inset-deep flex items-center justify-center mb-6">
              <div className="w-10 h-10 rounded-full shadow-neu-extruded bg-neu-success" />
            </div>
            <h2 className="text-2xl font-bold text-neu-fg mb-3">Recruiter Dashboard</h2>
            <p className="text-neu-muted font-medium">Post jobs and instantly shortlist candidates using vector similarity.</p>
          </div>
        </Link>

        {/* Academician Portal */}
        <Link href="/academician" className="block group">
          <div className="h-full bg-neu-bg rounded-[32px] p-10 shadow-neu-extruded transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-neu-hover active:translate-y-1 active:shadow-neu-inset flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full shadow-neu-inset-deep flex items-center justify-center mb-6">
              <div className="w-10 h-10 rounded-full shadow-neu-extruded bg-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-neu-fg mb-3">Academician Portal</h2>
            <p className="text-neu-muted font-medium">Engage in live projects, mentorships, and FDPs.</p>
          </div>
        </Link>

        {/* Institution Dashboard */}
        <Link href="/institution" className="block group">
          <div className="h-full bg-neu-bg rounded-[32px] p-10 shadow-neu-extruded transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-neu-hover active:translate-y-1 active:shadow-neu-inset flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full shadow-neu-inset-deep flex items-center justify-center mb-6">
              <div className="w-10 h-10 rounded-full shadow-neu-extruded bg-purple-500" />
            </div>
            <h2 className="text-2xl font-bold text-neu-fg mb-3">Institution Dashboard</h2>
            <p className="text-neu-muted font-medium">Monitor skill gaps, placement funnels, and industry trends.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
