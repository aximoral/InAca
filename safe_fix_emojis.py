import os
import re

def fix_file_regex(filepath, replacements):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    modified = False
    for pattern, good in replacements:
        new_content = re.sub(pattern, good, content)
        if new_content != content:
            content = new_content
            modified = True
            
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filepath}")

academician_replacements = [
    (r"Research Proposal dY.*?</DialogTitle>", "Research Proposal 🔬</DialogTitle>"),
    (r"\+ New Research Proposal dY.*", "+ New Research Proposal 🔬"),
    (r"Register for FDP dY.*?\"", "Register for FDP 👨‍🏫\""),
    (r"Registered o.*?\"", "Registered ✨\""),
    (r"Applied o.*?\"", "Applied ✨\"")
]
fix_file_regex('frontend/src/app/academician/page.tsx', academician_replacements)

student_replacements = [
    (r"Close the Gap \?", "Close the Gap →"),
    (r"Applied \? : \"Apply Now\"", "Applied ✓\" : \"Apply Now\""),
    (r"A-A- Auto-Fill:", "✨ Auto-Fill:"),
    (r"\{fileName \? \"A.*?\" : \"A.*?\"\}", "{fileName ? \"📄\" : \"📁\"}"),
    (r"\{ id: 'job', icon: 'A.*?', title: 'Find a Job'", "{ id: 'job', icon: '💼', title: 'Find a Job'"),
    (r"\{ id: 'network', icon: 'A.*?', title: 'Networking'", "{ id: 'network', icon: '🤝', title: 'Networking'"),
    (r"\{ id: 'mentor', icon: 'A.*?', title: 'Find a Mentor'", "{ id: 'mentor', icon: '🎓', title: 'Find a Mentor'")
]
fix_file_regex('frontend/src/app/student/page.tsx', student_replacements)

page_replacements = [
    (r"\{ role: 'Student', email: 'student@demo\.com', icon: 'dYZ.*?' \}", "{ role: 'Student', email: 'student@demo.com', icon: '🎓' }"),
    (r"\{ role: 'Recruiter', email: 'recruiter@demo\.com', icon: 'dY.*?' \}", "{ role: 'Recruiter', email: 'recruiter@demo.com', icon: '💼' }"),
    (r"\{ role: 'Academician', email: 'academician@demo\.com', icon: 'dY.*?' \}", "{ role: 'Academician', email: 'academician@demo.com', icon: '👨‍🏫' }"),
    (r"\{ role: 'Institution', email: 'institution@demo\.com', icon: 'dY.*?' \}", "{ role: 'Institution', email: 'institution@demo.com', icon: '🏛️' }")
]
fix_file_regex('frontend/src/app/page.tsx', page_replacements)

