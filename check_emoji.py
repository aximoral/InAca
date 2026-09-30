import re
with open('frontend/src/app/page.tsx', encoding='utf-8') as f:
    content = f.read()
m = re.search(r"role: 'Student'.*?icon: '(.*?)'", content, re.DOTALL)
if m:
    print(ascii(m.group(1)))
