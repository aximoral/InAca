import os

filepath = 'frontend/src/app/student/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the Close the gap arrow
content = content.replace('Close the Gap ?', 'Close the Gap →')
# Fix the Applied checkmark. Wait, looking at the syntax:
# hasApplied ? "Applied ? : "Apply Now" (wait, there's a missing quote in the output above!)
# Let's read the exact line.
