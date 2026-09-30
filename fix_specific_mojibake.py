import os
import re

filepath = 'frontend/src/app/onboarding/page.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    '\xe2\u0161\xa1': '⚡',
    '\xf0\u0178\u201c\xb7': '📸',
    '\xe2\u0153\u2026': '✅',
    '\xf0\u0178\u201c\u201e': '📄',
    '\xc3\u2014': '×',
    '\xf0\u0178\u2019\xbc': '💼',
    '\xf0\u0178\xa4\x9d': '🤝',
    '\xf0\u0178\xa7\xa0': '🧠',
    '\xf0\u0178\x8f\xa2': '🏢',
    '\xe2\u2020\x90': '←',
    '\xe2\u2020\u2019': '→'
}

for bad, good in replacements.items():
    content = content.replace(bad, good)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Replaced all specific mojibake in onboarding/page.tsx")
