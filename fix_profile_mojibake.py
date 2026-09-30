import os

filepath = 'frontend/src/app/profile/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    '\xe2\u0153\x8f\xef\xb8\x8f': '✏️',
    '\xc3\u2014': '×'
}

for bad, good in replacements.items():
    content = content.replace(bad, good)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Replaced specific mojibake in profile/page.tsx")
