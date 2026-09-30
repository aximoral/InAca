import os
import re

filepath = 'frontend/src/app/page.tsx'
with open(filepath, 'rb') as f:
    content = f.read().decode('utf-8', errors='replace')

# Because mojibake is completely unpredictable, we just regex replace the whole line based on the email.
content = re.sub(r"\{\s*role:\s*'Student',\s*email:\s*'student@demo\.com',\s*icon:.*?\},", "{ role: 'Student', email: 'student@demo.com', icon: '🎓' },", content)
content = re.sub(r"\{\s*role:\s*'Recruiter',\s*email:\s*'recruiter@demo\.com',\s*icon:.*?\},", "{ role: 'Recruiter', email: 'recruiter@demo.com', icon: '💼' },", content)
content = re.sub(r"\{\s*role:\s*'Academician',\s*email:\s*'academician@demo\.com',\s*icon:.*?\},", "{ role: 'Academician', email: 'academician@demo.com', icon: '👨‍🏫' },", content)
content = re.sub(r"\{\s*role:\s*'Institution',\s*email:\s*'institution@demo\.com',\s*icon:.*?\},", "{ role: 'Institution', email: 'institution@demo.com', icon: '🏛️' },", content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
