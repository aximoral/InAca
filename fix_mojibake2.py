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
    (r'My Profile [^<]*<\/Button>', 'My Profile 👤</Button>'),
    (r'Complete Profile [^<]*<\/Button>', 'Complete Profile ✨</Button>'),
    (r'Close the Gap [^<]*<\/Button>', 'Close the Gap ↗</Button>'),
    (r'"Applied [^"]*"', '"Applied ✓"'),
    (r'"Enrolled [^"]*"', '"Enrolled ✓"'),
    (r'"Registered [^"]*"', '"Registered ✓"'),
    (r'"Register for FDP [^"]*"', '"Register for FDP 📚"'),
    (r'New Research Proposal [^<]*<\/DialogTitle>', 'New Research Proposal 🔬</DialogTitle>'),
    (r'\+ New Research Proposal [^\n]*\n', '+ New Research Proposal 🔬\n'),
    (r'Edit Profile [^<]*<\/Button>', 'Edit Profile ✏️</Button>'),
    (r'"Complete Profile [^"]*"', '"Complete Profile ✨"'),
    
    # Specific ones for academician icons
    (r'<div className="w-12 h-12 rounded-full shadow-neu-inset flex items-center justify-center text-xl">\s*dY\'\s*<\/div>', '<div className="w-12 h-12 rounded-full shadow-neu-inset flex items-center justify-center text-xl">\n                    🤝\n                </div>'),
    (r'<div className="w-12 h-12 rounded-full shadow-neu-inset flex items-center justify-center text-xl">\s*dY"s\s*<\/div>', '<div className="w-12 h-12 rounded-full shadow-neu-inset flex items-center justify-center text-xl">\n                    📚\n                </div>'),
    (r'<div className="w-12 h-12 rounded-full shadow-neu-inset flex items-center justify-center text-xl">\s*\?\?\s*<\/div>', '<div className="w-12 h-12 rounded-full shadow-neu-inset flex items-center justify-center text-xl">\n                    🚀\n                </div>'), # generic
    
    # Onboarding
    (r'\? Auto-Fill:', '✨ Auto-Fill:'),
    (r'\{fileName \? "\?" : "\?\?"\}', '{fileName ? "✓" : "📁"}'),
    
    # The icon list in onboarding
    (r"icon: '\?\?', title: 'Find a Job'", "icon: '💼', title: 'Find a Job'"),
    (r"icon: '\?\?', title: 'Networking'", "icon: '🤝', title: 'Networking'"),
    (r"icon: '\?\?', title: 'Find a Mentor'", "icon: '🎓', title: 'Find a Mentor'"),
    (r"icon: '\?\?', title: 'Hiring'", "icon: '🏢', title: 'Hiring'"),
    (r"icon: '🤝', title: 'Find a Job'", "icon: '💼', title: 'Find a Job'"),
    
    # Onboarding buttons
    (r'Back\s*<\/Button>', '← Back</Button>'),
    (r'Continue\s*<\/Button>', 'Continue →</Button>'),
]

for filepath in files_to_fix:
    if not os.path.exists(filepath): continue
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
print('Done!')
