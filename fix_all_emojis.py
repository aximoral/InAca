import os
import re

directory = 'frontend/src/app'

mojibake_map = {
    'dY"': '👤',
    'o.': '📄',
    'dY",': '📁',
    'dY\'': '💼',
    'dY ?': '🤝',
    'dY ': '🎓',
    'dY?': '🏢',
    '+? +?': '←',
    '+\'': '→',
    'o?,?': '✏️',
    'o': '✨',
    'dY"': '🚀',
    'dY"': '📈',
    'dY"': '🔍',
    'o"': '✨',
    '?': '✨',
    '??': '✨',
    'A-': '✖'
}

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    modified = False
    
    # First apply known mojibake map
    for bad, good in mojibake_map.items():
        if bad in content:
            content = content.replace(bad, good)
            modified = True
            
    # Remove any remaining replacement characters that ruin the UI
    if '' in content:
        content = content.replace('', '')
        modified = True
        
    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {filepath}")

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx'):
            clean_file(os.path.join(root, file))
            
print("Cleanup done!")
