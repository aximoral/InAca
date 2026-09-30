import os

filepath = 'frontend/src/app/page.tsx'
with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# find array start and end
start = content.find("            {[")
end = content.find("            ].map((demo) => (")

if start != -1 and end != -1:
    new_array = '''            {[
              { role: 'Student', email: 'student@demo.com', icon: '🎓' },
              { role: 'Recruiter', email: 'recruiter@demo.com', icon: '💼' },
              { role: 'Academician', email: 'academician@demo.com', icon: '👨‍🏫' },
              { role: 'Institution', email: 'institution@demo.com', icon: '🏛️' },
'''
    content = content[:start] + new_array + content[end:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        print("Replaced array!")
