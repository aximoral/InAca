"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function AuthPortal() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e?: React.FormEvent, overrideEmail?: string, overridePassword?: string) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");

    const finalEmail = overrideEmail || email;
    const finalPassword = overridePassword || password;

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const payload = isLogin ? { email: finalEmail, password: finalPassword } : { email: finalEmail, password: finalPassword, role };

    try {
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user_id", data.id);
        localStorage.setItem("role", data.role);
        
        const routeMap: Record<string, string> = {
          "STUDENT": "/student",
          "RECRUITER": "/recruiter",
          "ACADEMICIAN": "/academician",
          "INSTITUTION": "/institution",
        };
        
        router.push(routeMap[data.role] || "/");
      } else {
        setError(data.detail || "Authentication failed.");
      }
    } catch (err) {
      setError("Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setIsLogin(true);
    handleAuth(undefined, demoEmail, "password123");
  };

  const inputStyle = "w-full bg-neu-bg shadow-neu-inset-deep rounded-2xl p-4 text-neu-fg outline-none focus-ring font-medium placeholder:text-neu-muted/50 transition-all";

  return (
    <div className="min-h-screen bg-neu-bg flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden relative">
      
      {/* Ambient background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full shadow-neu-extruded opacity-50 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full shadow-neu-inset-deep opacity-50 pointer-events-none" />

      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-neu-fg mb-12 relative z-10 text-center">
        Skill<span className="text-neu-accent">Sync</span>
      </h1>
      
      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl">{isLogin ? "Welcome Back" : "Create an Account"}</CardTitle>
          <CardDescription>
            {isLogin ? "Log in to access your dashboard" : "Join the ultimate collaboration platform"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          
          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-neu-fg mb-2 ml-2">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" 
                className={inputStyle} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-neu-fg mb-2 ml-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className={`${inputStyle} pr-12`} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neu-muted hover:text-neu-accent transition-colors focus:outline-none focus:text-neu-accent"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-neu-fg mb-2 ml-2">I am a...</label>
                <div className="shadow-neu-inset-deep rounded-2xl p-3 flex items-center bg-neu-bg">
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full text-sm border-none bg-transparent outline-none cursor-pointer font-bold text-neu-fg appearance-none px-2"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="RECRUITER">Recruiter</option>
                    <option value="ACADEMICIAN">Academician</option>
                    <option value="INSTITUTION">Institution</option>
                  </select>
                </div>
              </div>
            )}

            {error && <div className="text-red-500 text-sm font-bold text-center bg-red-100 p-3 rounded-xl shadow-neu-inset-small">{error}</div>}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Processing..." : (isLogin ? "Log In" : "Sign Up")}
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-transparent shadow-neu-inset-small pt-6 mx-[-1.5rem] px-6">
             <p className="text-neu-muted font-bold text-sm mb-4">
               {isLogin ? "Don't have an account?" : "Already have an account?"}
               <button type="button" onClick={() => setIsLogin(!isLogin)} className="ml-2 text-neu-accent hover:underline focus:outline-none">
                 {isLogin ? "Sign Up" : "Log In"}
               </button>
             </p>
          </div>

        </CardContent>
      </Card>

      {/* Quick Demo Access Section */}
      <div className="w-full max-w-3xl mt-16 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center gap-4 mb-6 justify-center">
          <div className="h-[2px] w-12 bg-neu-muted/20 shadow-neu-inset-small rounded-full"></div>
          <h3 className="text-sm font-bold text-neu-muted tracking-widest uppercase">Quick Demo Access</h3>
          <div className="h-[2px] w-12 bg-neu-muted/20 shadow-neu-inset-small rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { role: 'Student', email: 'student@demo.com', icon: '🎓' },
            { role: 'Recruiter', email: 'recruiter@demo.com', icon: '💼' },
            { role: 'Academician', email: 'academician@demo.com', icon: '📚' },
            { role: 'Institution', email: 'institution@demo.com', icon: '🏛️' },
          ].map((demo) => (
            <div 
              key={demo.role}
              onClick={() => handleDemoLogin(demo.email)}
              className="bg-neu-bg rounded-2xl p-6 shadow-neu-extruded transition-all duration-300 hover:-translate-y-1 hover:shadow-neu-hover active:translate-y-1 active:shadow-neu-inset cursor-pointer flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-full shadow-neu-inset flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
                {demo.icon}
              </div>
              <span className="font-bold text-neu-fg text-sm">{demo.role}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
