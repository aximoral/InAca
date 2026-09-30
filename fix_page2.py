import os
import re

filepath = 'frontend/src/app/page.tsx'
with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

pattern = r"\{\[\s*\{ role: 'Student'.*?\]\.map"
replacement = r'''{[
              { role: 'Student', email: 'student@demo.com', icon: '🎓' },
              { role: 'Recruiter', email: 'recruiter@demo.com', icon: '💼' },
              { role: 'Academician', email: 'academician@demo.com', icon: '👨‍🏫' },
              { role: 'Institution', email: 'institution@demo.com', icon: '🏛️' },
            ].map'''

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
if new_content != content:
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Replaced!")
else:
    print("Failed to replace!")
