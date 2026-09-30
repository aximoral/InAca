import os
import re
with open('frontend/src/app/student/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.findall(r"icon: '(.*?)'", content)
for icon in m:
    print("Found icon:", ascii(icon))

m2 = re.findall(r"Applied .*? \"Apply Now\"", content)
for app in m2:
    print("Found applied string:", ascii(app))

