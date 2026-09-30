import os
import re

files_to_fix = [
    'frontend/src/app/student/page.tsx',
    'frontend/src/app/recruiter/page.tsx',
    'frontend/src/app/academician/page.tsx',
    'frontend/src/app/onboarding/page.tsx',
    'frontend/src/app/profile/page.tsx'
]

replacements = [
    (r'My Profile .*? <\/Button>', 'My Profile 👤 </Button>'),
    (r'Complete Profile .*?<\/Button>', 'Complete Profile ✨</Button>'),
    (r'Close the Gap .*?<\/Button>', 'Close the Gap ↗</Button>'),
    (r'"Applied .*?"', '"Applied ✓"'),
    (r'"Enrolled .*?"', '"Enrolled ✓"'),
    (r'"Registered .*?"', '"Registered ✓"'),
    (r'"Register for FDP .*?"', '"Register for FDP 📚"'),
    (r'New Research Proposal .*?<\/DialogTitle>', 'New Research Proposal 🔬</DialogTitle>'),
    (r'\+ New Research Proposal .*?\n', '+ New Research Proposal 🔬\n'),
    (r'dY"', '🔬'),
    (r"dY'", '🤝'),
    (r'dY"s', '📚'),
    (r'\? Auto-Fill:', '✨ Auto-Fill:'),
    (r'\{fileName \? "\?" : "\?\?"\}', '{fileName ? "✓" : "📁"}'),
    (r"icon: '\?\?'", "icon: '🤝'"), # We'll just replace all ?? icons with relevant ones using a more targeted approach if needed.
    (r'Edit Profile \?\?', 'Edit Profile ✏️'),
    (r'"Complete Profile \?"', '"Complete Profile ✨"')
]

for filepath in files_to_fix:
    if not os.path.exists(filepath): continue
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)
        
    # Manual icon fixes for onboarding
    content = content.replace("id: 'job', icon: '🤝'", "id: 'job', icon: '💼'")
    content = content.replace("id: 'mentor', icon: '🤝'", "id: 'mentor', icon: '🎓'")
    content = content.replace("id: 'hire', icon: '🤝'", "id: 'hire', icon: '🏢'")
    
    # Any remaining non-ascii corrupted marks (like ) can be tricky, we'll see if the above caught most.
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
print('Done!')
