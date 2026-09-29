"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  // Demo User State
  const [demoUserId, setDemoUserId] = useState<string>("");

  useEffect(() => {
    // Fetch a demo student ID to simulate a logged-in user session
    fetch("http://localhost:8000/api/users/students")
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setDemoUserId(data[0].id);
      })
      .catch((err) => console.error("Error fetching demo user:", err));
  }, []);
  
  // Form State
  const [headline, setHeadline] = useState("Full-Stack Developer passionate about AI");
  const [skills, setSkills] = useState<string[]>(["Python", "React"]);
  const [skillInput, setSkillInput] = useState("");
  const [goal, setGoal] = useState<string>("job");
  
  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progressPercentage = (step / totalSteps) * 100;

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim() !== '') {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleComplete = async () => {
    if (!demoUserId) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8000/api/profiles/${demoUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: headline,
          skills: skills
        })
      });

      if (response.ok) {
        router.push("/student");
      } else {
        console.error("Failed to update profile");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setIsSubmitting(false);
    }
  };

  // Shared Input Style
  const inputStyle = "w-full bg-neu-bg shadow-neu-inset-deep rounded-2xl p-4 text-neu-fg outline-none focus-ring font-medium placeholder:text-neu-muted/50 transition-all";

  return (
    <div className="min-h-screen bg-neu-bg flex flex-col items-center justify-center p-4 md:p-8">
      
      <div className="w-full max-w-3xl mb-8 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-neu-fg mb-6">Complete Your Profile</h1>
        
        {/* Neumorphic Progress Bar */}
        <div className="w-full h-4 rounded-full bg-neu-bg shadow-neu-inset-deep overflow-hidden">
          <div 
            className="h-full bg-neu-accent rounded-full shadow-neu-extruded transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-sm font-bold text-neu-muted mt-4">Step {step} of {totalSteps}</p>
      </div>

      <Card className="w-full max-w-3xl">
        <CardHeader className="pb-8">
          <CardTitle className="text-2xl">
            {step === 1 && "1. The Basics"}
            {step === 2 && "2. Professional Identity"}
            {step === 3 && "3. Experience & History"}
            {step === 4 && "4. Your Goals"}
          </CardTitle>
          <CardDescription className="text-base">
            {step === 1 && "Let's start with a picture and a headline to help people get to know you."}
            {step === 2 && "Tag your core competencies and attach your resume."}
            {step === 3 && "Briefly map out your academic and professional journey."}
            {step === 4 && "What brings you to SkillSync today?"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8 min-h-[300px]">
          
          {/* STEP 1: Basics */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-32 h-32 rounded-full shadow-neu-inset-deep flex items-center justify-center shrink-0 bg-neu-bg cursor-pointer hover:shadow-neu-inset transition-all group">
                   <div className="w-12 h-12 rounded-full shadow-neu-extruded-small flex items-center justify-center text-neu-muted group-hover:text-neu-accent transition-colors">
                     📷
                   </div>
                </div>
                <div className="w-full space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-neu-fg mb-2 ml-2">Full Name</label>
                    <input type="text" placeholder="e.g. Jane Doe" className={inputStyle} defaultValue="Harshvardhan D K" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-neu-fg mb-2 ml-2">Professional Headline</label>
                <input 
                  type="text" 
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Full-Stack Developer passionate about AI" 
                  className={inputStyle} 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-neu-fg mb-2 ml-2">Location / Remote Preference</label>
                <input type="text" placeholder="e.g. San Francisco, CA (Open to Remote)" className={inputStyle} />
              </div>
            </div>
          )}

          {/* STEP 2: Professional (Tags) */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <label className="block text-sm font-bold text-neu-fg mb-2 ml-2">Resume Upload (PDF/Docx)</label>
                
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileChange}
                />
                
                {/* Visual Neumorphic Drop Zone */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-transparent shadow-neu-inset-deep bg-neu-bg rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200/20 transition-colors"
                >
                  <div className="w-16 h-16 rounded-full shadow-neu-extruded bg-neu-bg flex items-center justify-center mb-4 text-2xl">
                    {fileName ? "✅" : "📄"}
                  </div>
                  <p className="font-bold text-neu-fg">
                    {fileName ? fileName : "Click to attach your resume"}
                  </p>
                  <p className="text-sm text-neu-muted mt-2">
                    {fileName ? "File successfully attached" : "We'll automatically parse it to build your profile"}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-neu-fg mb-2 ml-2">Core Skills</label>
                <div className="shadow-neu-inset-deep bg-neu-bg rounded-2xl p-4 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                      <Badge key={skill} variant="default" className="flex items-center gap-2 py-2 px-4 cursor-pointer group hover:bg-red-50 hover:text-red-600 hover:shadow-neu-inset-small" onClick={() => removeSkill(skill)}>
                        {skill} <span className="opacity-50 group-hover:opacity-100 font-bold">×</span>
                      </Badge>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Type a skill and press Enter..." 
                    className="w-full bg-transparent border-none outline-none font-medium text-neu-fg placeholder:text-neu-muted/50 p-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: History */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="p-6 rounded-[32px] shadow-neu-extruded bg-neu-bg space-y-4">
                <h3 className="font-bold text-lg text-neu-fg border-b border-transparent shadow-neu-inset-small pb-2 inline-block px-4 rounded-xl">Current Experience</h3>
                <div>
                  <label className="block text-sm font-bold text-neu-muted mb-2 ml-2 mt-4">Job Title & Company</label>
                  <input type="text" placeholder="Software Engineer at TechCorp" className={inputStyle} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-neu-muted mb-2 ml-2">Start Date</label>
                    <input type="text" placeholder="MM/YYYY" className={inputStyle} />
                  </div>
                  <div className="flex items-center gap-3 mt-8">
                     <input type="checkbox" className="w-5 h-5 rounded shadow-neu-inset accent-neu-accent" defaultChecked />
                     <span className="font-bold text-sm text-neu-fg">I currently work here</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-[32px] shadow-neu-extruded bg-neu-bg space-y-4">
                <h3 className="font-bold text-lg text-neu-fg border-b border-transparent shadow-neu-inset-small pb-2 inline-block px-4 rounded-xl">Education</h3>
                <div>
                  <label className="block text-sm font-bold text-neu-muted mb-2 ml-2 mt-4">University & Degree</label>
                  <input type="text" placeholder="B.S. Computer Science, State University" className={inputStyle} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Goals */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="font-bold text-lg text-neu-fg mb-4">What is your primary goal on SkillSync?</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'job', icon: '💼', title: 'Find a Job', desc: 'Looking for full-time or internships.' },
                  { id: 'network', icon: '🤝', title: 'Networking', desc: 'Connect with industry professionals.' },
                  { id: 'mentor', icon: '🧠', title: 'Find a Mentor', desc: 'Looking for guidance and advice.' },
                  { id: 'hire', icon: '🏢', title: 'Hiring', desc: 'Looking for talent for my company.' }
                ].map((opt) => (
                  <div 
                    key={opt.id}
                    onClick={() => setGoal(opt.id)}
                    className={`p-6 rounded-[24px] cursor-pointer transition-all duration-300 flex flex-col items-center text-center gap-3 ${
                      goal === opt.id 
                        ? 'shadow-neu-inset-deep bg-neu-bg ring-2 ring-neu-accent ring-offset-4 ring-offset-neu-bg' 
                        : 'shadow-neu-extruded bg-neu-bg hover:-translate-y-1 hover:shadow-neu-hover'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full shadow-neu-inset flex items-center justify-center text-2xl">
                      {opt.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-neu-fg">{opt.title}</h4>
                      <p className="text-sm font-medium text-neu-muted mt-1">{opt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </CardContent>
        
        {/* Navigation Footer */}
        <div className="p-8 pt-0 flex justify-between items-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1 || isSubmitting}
          >
            ← Back
          </Button>
          
          {step < totalSteps ? (
            <Button onClick={() => setStep(s => Math.min(totalSteps, s + 1))}>
              Continue →
            </Button>
          ) : (
            <Button 
              onClick={handleComplete} 
              disabled={isSubmitting || !demoUserId}
              className="bg-neu-success shadow-neu-extruded hover:shadow-neu-hover hover:-translate-y-1 text-white disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Complete Profile ✨"}
            </Button>
          )}
        </div>
      </Card>
      
    </div>
  );
}
