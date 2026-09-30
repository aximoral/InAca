import os

filepath = 'frontend/src/app/onboarding/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Reverse the double encoding
try:
    fixed_content = content.encode('cp1252').decode('utf-8')
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(fixed_content)
    print("Fixed double-encoding in onboarding/page.tsx")
except Exception as e:
    print(f"Failed to reverse encoding: {e}")
