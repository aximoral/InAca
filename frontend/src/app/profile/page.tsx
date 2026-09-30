"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // View State
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);

  // Edit State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("user_id");
    if (!id) {
      window.location.href = '/';
      return;
    }
    setUserId(id);

    const fetchData = async () => {
      try {
        const [profileRes, skillsRes] = await Promise.all([
          fetch(`http://localhost:8000/api/profiles/${id}`),
          fetch(`http://localhost:8000/api/students/${id}/skills`)
        ]);
        
        const profileData = await profileRes.json();
        const skillsData = await skillsRes.json();

        if (profileRes.ok && !profileData.detail) {
          setProfile(profileData);
          setFirstName(profileData.first_name || "");
          setLastName(profileData.last_name || "");
          setBio(profileData.bio || "");
        }
        
        if (skillsRes.ok) {
          const skillNames = (skillsData || []).map((s: any) => s.skill_name || s);
          setSkills(skillNames);
          setSelectedSkills(skillNames);
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const skillsToAdd = currentSkill.split(',').map(s => s.trim()).filter(s => s !== '');
      
      const newSkills = [...selectedSkills];
      skillsToAdd.forEach(skill => {
        if (!newSkills.includes(skill)) {
          newSkills.push(skill);
        }
      });
      
      setSelectedSkills(newSkills);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:8000/api/profiles/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          bio: bio,
          skills: selectedSkills
        })
      });

      if (response.ok) {
        // Update local view state
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        setSkills(selectedSkills);
        setIsEditing(false);
      } else {
        console.error("Failed to save profile");
      }
    } catch (err) {
      console.error("Error saving profile", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neu-bg flex items-center justify-center">
        <div className="animate-pulse text-neu-muted text-xl font-bold">Loading Profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neu-bg p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-neu-bg shadow-neu-extruded rounded-3xl p-6 mb-8 border border-white/20">
          <div>
            <h1 className="text-3xl font-black text-neu-fg tracking-tight">My Profile</h1>
            <p className="text-neu-fg-muted mt-2">Manage your personal information and skills.</p>
          </div>
          <div className="flex gap-4">
             <Button variant="outline" onClick={() => window.location.href='/student'} className="shadow-neu-extruded hover:shadow-neu-hover hover:-translate-y-1">Back to Dashboard</Button>
          </div>
        </div>

        {/* Content */}
        {!isEditing ? (
          // View Mode
          <Card className="max-w-2xl mx-auto bg-neu-bg border-none shadow-neu-extruded rounded-3xl overflow-hidden">
            <CardHeader className="items-center text-center pb-2">
              <div className="w-32 h-32 rounded-full shadow-neu-inset-deep flex items-center justify-center mb-6">
                 <div className="w-28 h-28 bg-neu-bg rounded-full shadow-neu-extruded flex items-center justify-center text-4xl font-bold text-neu-accent">
                    {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                 </div>
              </div>
              <CardTitle className="text-3xl font-extrabold text-neu-fg">
                {profile?.first_name} {profile?.last_name}
              </CardTitle>
              <CardDescription className="text-lg text-neu-muted mt-2">
                {profile?.organization_name || "Independent Student"}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-6 space-y-8">
              <div className="p-6 bg-neu-bg shadow-neu-inset rounded-2xl">
                <h4 className="text-sm font-bold text-neu-fg uppercase tracking-wider mb-3">About Me</h4>
                <p className="text-neu-fg text-lg italic leading-relaxed">
                  {profile?.bio ? `"${profile.bio}"` : "No bio provided yet."}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-neu-fg uppercase tracking-wider mb-4">Verified Skills</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  {skills.length > 0 ? (
                    skills.map((skill, i) => (
                      <Badge key={i} variant="default" className="text-sm px-4 py-2 shadow-neu-extruded hover:shadow-neu-hover hover:-translate-y-1 transition-all">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-neu-muted italic">No skills listed.</span>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-center pb-8 pt-4">
              <Button onClick={() => setIsEditing(true)} className="px-8 shadow-neu-extruded hover:shadow-neu-hover hover:-translate-y-1 text-lg">
                Edit Profile ✏️</Button>
            </CardFooter>
          </Card>
        ) : (
          // Edit Mode
          <Card className="max-w-2xl mx-auto bg-neu-bg border-none shadow-neu-extruded rounded-3xl overflow-hidden p-8">
            <h2 className="text-2xl font-bold text-neu-fg mb-8 text-center">Edit Profile</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="block text-sm font-bold text-neu-fg mb-2 ml-2">First Name</Label>
                  <Input 
                    placeholder="First Name" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-neu-bg border-none shadow-neu-inset rounded-2xl p-4 text-neu-fg placeholder:text-neu-muted focus:ring-2 focus:ring-neu-accent/50 focus:shadow-neu-inset-deep transition-all duration-300 h-14"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-bold text-neu-fg mb-2 ml-2">Last Name</Label>
                  <Input 
                    placeholder="Last Name" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-neu-bg border-none shadow-neu-inset rounded-2xl p-4 text-neu-fg placeholder:text-neu-muted focus:ring-2 focus:ring-neu-accent/50 focus:shadow-neu-inset-deep transition-all duration-300 h-14"
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-bold text-neu-fg mb-2 ml-2">Professional Headline / Bio</Label>
                <Input 
                  placeholder="e.g. Full Stack Developer | AI Enthusiast" 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-neu-bg border-none shadow-neu-inset rounded-2xl p-4 text-neu-fg placeholder:text-neu-muted focus:ring-2 focus:ring-neu-accent/50 focus:shadow-neu-inset-deep transition-all duration-300 h-14"
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <Label className="block text-sm font-bold text-neu-fg mb-2 ml-2">Skills (Press Enter to add)</Label>
                <div className="space-y-4">
                  <Input 
                    placeholder="e.g. React, Python, UI/UX" 
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyDown={handleAddSkill}
                    className="w-full bg-neu-bg border-none shadow-neu-inset rounded-2xl p-4 text-neu-fg placeholder:text-neu-muted focus:ring-2 focus:ring-neu-accent/50 focus:shadow-neu-inset-deep transition-all duration-300 h-14"
                  />
                  <div className="flex flex-wrap gap-2 min-h-[60px] p-4 bg-neu-bg shadow-neu-inset rounded-2xl">
                    {selectedSkills.map((skill, index) => (
                      <Badge 
                        key={index}
                        variant="default" 
                        className="px-3 py-1.5 flex items-center gap-2 cursor-pointer group shadow-neu-extruded"
                        onClick={() => removeSkill(skill)}
                      >
                        {skill}
                        <span className="text-white/50 group-hover:text-white transition-colors">×</span>
                      </Badge>
                    ))}
                    {selectedSkills.length === 0 && (
                      <span className="text-neu-muted italic text-sm py-1">No skills added yet</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-8">
                <Button variant="outline" onClick={() => setIsEditing(false)} className="shadow-neu-extruded hover:shadow-neu-hover hover:-translate-y-1">
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving} className="px-8 shadow-neu-extruded hover:shadow-neu-hover hover:-translate-y-1">
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
