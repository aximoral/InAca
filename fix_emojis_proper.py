import os
import re

files = [
    'frontend/src/app/page.tsx',
    'frontend/src/app/student/page.tsx',
    'frontend/src/app/recruiter/page.tsx',
    'frontend/src/app/academician/page.tsx',
    'frontend/src/app/onboarding/page.tsx',
    'frontend/src/app/institution/page.tsx'
]

emoji_replacements = {
    r"\{ role: 'Student', email: 'student@demo\.com', icon: '[^']+' \}": "{ role: 'Student', email: 'student@demo.com', icon: '🎓' }",
    r"\{ role: 'Recruiter', email: 'recruiter@demo\.com', icon: '[^']+' \}": "{ role: 'Recruiter', email: 'recruiter@demo.com', icon: '💼' }",
    r"\{ role: 'Academician', email: 'academician@demo\.com', icon: '[^']+' \}": "{ role: 'Academician', email: 'academician@demo.com', icon: '👨‍🏫' }",
    r"\{ role: 'Institution', email: 'institution@demo\.com', icon: '[^']+' \}": "{ role: 'Institution', email: 'institution@demo.com', icon: '🏛️' }",
    # academician tabs
    r"Research Proposal [^\s<]+</DialogTitle>": "Research Proposal 🔬</DialogTitle>",
    r"New Research Proposal [^\s<]+": "New Research Proposal 🔬",
    r"Register for FDP [^\s<]+": "Register for FDP 👨‍🏫",
    r"Registered [^\s<]+": "Registered ✨",
    r"Applied [^\s<]+": "Applied ✨",
    # student items
    r"\{ id: 'job', icon: '[^']+', title: 'Find a Job'": "{ id: 'job', icon: '💼', title: 'Find a Job'",
    r"\{ id: 'network', icon: '[^']+', title: 'Networking'": "{ id: 'network', icon: '🤝', title: 'Networking'",
    r"\{ id: 'mentor', icon: '[^']+', title: 'Find a Mentor'": "{ id: 'mentor', icon: '🎓', title: 'Find a Mentor'",
    r"A-A- Auto-Fill:": "✨ Auto-Fill:",
    r"\{fileName \? \"[^\"]+\" : \"[^\"]+\"\}": '{fileName ? "📄" : "📁"}',
    r"<span className=\"opacity-50 group-hover:opacity-100 font-bold\">[^<]+</span>": '<span className="opacity-50 group-hover:opacity-100 font-bold">✨</span>'
}

for filepath in files:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()
    
    modified = False
    for pattern, replacement in emoji_replacements.items():
        new_content = re.sub(pattern, replacement, content)
        if new_content != content:
            content = new_content
            modified = True
            
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed emojis in {filepath}")
