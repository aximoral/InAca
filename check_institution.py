import os
import re

filepath = 'frontend/src/app/institution/page.tsx'
if os.path.exists(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    weird = re.findall(r'[\u0080-\uFFFF]+', content)
    weird_unique = set()
    for w in weird:
        if w not in weird_unique:
            weird_unique.add(w)
            print(f"{filepath} has non-ascii: {ascii(w)}")
