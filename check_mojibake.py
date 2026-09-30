import os

files_to_fix = [
    'frontend/src/app/student/page.tsx',
    'frontend/src/app/recruiter/page.tsx',
    'frontend/src/app/academician/page.tsx',
    'frontend/src/app/onboarding/page.tsx',
    'frontend/src/app/profile/page.tsx'
]

targets = ['dY"', "dY'", 'dY"s', '??', '? Auto-Fill', 'o"', 'o.']
found_any = False

for filepath in files_to_fix:
    if not os.path.exists(filepath): continue
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    for t in targets:
        if t in content:
            print(f'Found "{t}" in {filepath}')
            found_any = True

if not found_any:
    print('Clean!')
