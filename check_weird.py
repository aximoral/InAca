import os
import re

for filepath in [
    'frontend/src/app/academician/page.tsx',
    'frontend/src/app/recruiter/page.tsx',
    'frontend/src/app/institution/page.tsx',
    'frontend/src/app/onboarding/page.tsx'
]:
    if not os.path.exists(filepath): continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Look for weird characters
    weird = re.findall(r'[\u0080-\uFFFF]+', content)
    weird_unique = set()
    for w in weird:
        if w not in weird_unique:
            weird_unique.add(w)
            print(f"{filepath} has non-ascii: {ascii(w)}")
