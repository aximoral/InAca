import re
with open('frontend/src/app/student/page.tsx', encoding='utf-8') as f:
    content = f.read()
m = re.search(r"id: 'job'.*?icon: '(.*?)'", content, re.DOTALL)
if m:
    print('job icon:', ascii(m.group(1)))
m2 = re.search(r"Auto-Fill", content)
if m2:
    start = max(0, m2.start() - 10)
    print('Auto-Fill:', ascii(content[start:m2.end()]))
