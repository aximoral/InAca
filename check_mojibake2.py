import os
for filepath in ['frontend/src/app/student/page.tsx', 'frontend/src/app/recruiter/page.tsx']:
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        for i, line in enumerate(f):
            if 'o"' in line:
                print(f'{filepath}:{i+1} has o"')
