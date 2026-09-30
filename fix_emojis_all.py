import os
import re

files_replacements = [
    (
        'frontend/src/app/academician/page.tsx',
        r"Research Proposal [^<]+</DialogTitle>",
        "Research Proposal 🔬</DialogTitle>"
    ),
    (
        'frontend/src/app/academician/page.tsx',
        r"\+ New Research Proposal [^\n<]+",
        "+ New Research Proposal 🔬"
    ),
    (
        'frontend/src/app/academician/page.tsx',
        r"Register for FDP [^\n<]+",
        "Register for FDP 👨‍🏫"
    ),
    (
        'frontend/src/app/academician/page.tsx',
        r"Registered [^\n<]+",
        "Registered ✨"
    ),
    (
        'frontend/src/app/academician/page.tsx',
        r"Applied [^\n<]+",
        "Applied ✨"
    ),
    (
        'frontend/src/app/student/page.tsx',
        r"\{ id: 'job', icon: '[^']+', title: 'Find a Job'",
        "{ id: 'job', icon: '💼', title: 'Find a Job'"
    ),
    (
        'frontend/src/app/student/page.tsx',
        r"\{ id: 'network', icon: '[^']+', title: 'Networking'",
        "{ id: 'network', icon: '🤝', title: 'Networking'"
    ),
    (
        'frontend/src/app/student/page.tsx',
        r"\{ id: 'mentor', icon: '[^']+', title: 'Find a Mentor'",
        "{ id: 'mentor', icon: '🎓', title: 'Find a Mentor'"
    ),
    (
        'frontend/src/app/student/page.tsx',
        r"[^\s<>]+ Auto-Fill:",
        "✨ Auto-Fill:"
    ),
    (
        'frontend/src/app/student/page.tsx',
        r"\{fileName \? \"[^\"]+\" : \"[^\"]+\"\}",
        '{fileName ? "📄" : "📁"}'
    ),
    (
        'frontend/src/app/student/page.tsx',
        r"<span className=\"opacity-50 group-hover:opacity-100 font-bold\">[^<]+</span>",
        '<span className="opacity-50 group-hover:opacity-100 font-bold">✨</span>'
    )
]

for filepath, pattern, replacement in files_replacements:
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    new_content = re.sub(pattern, replacement, content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {pattern} in {filepath}")
