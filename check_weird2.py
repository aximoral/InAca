import os
import re

for filepath in [
    'frontend/src/app/page.tsx',
    'frontend/src/app/student/page.tsx',
    'frontend/src/app/profile/page.tsx'
]:
    if not os.path.exists(filepath): continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    weird = re.findall(r'[\u0080-\uFFFF]+', content)
    weird_unique = set()
    for w in weird:
        if w not in weird_unique:
            weird_unique.add(w)
            print(f"{filepath} has non-ascii: {ascii(w)}")
