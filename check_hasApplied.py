with open('frontend/src/app/student/page.tsx', encoding='utf-8', errors='ignore') as f:
    content = f.read()
import re
print("hasApplied 1:", ascii(re.search(r'const hasApplied.*?;', content).group(0)))
print("hasApplied 2:", ascii(re.search(r'applyingJobId === job\.job_id \? .*?\}', content).group(0)))
