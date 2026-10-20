import os
import re

files_to_check = [
    "README.md",
    "docs/README.md",
    "docs/PROJECT_STATUS.md",
    "docs/LANGUAGE_KERNEL_INTEGRATION_AUDIT.md"
]

link_pattern = re.compile(r'\[([^\]]+)\]\(([^)]+)\)')

broken_links = 0
total_links = 0

print("=== Markdown Link Verification Report ===")

for filepath in files_to_check:
    if not os.path.exists(filepath):
        print(f"[ERROR] File not found: {filepath}")
        broken_links += 1
        continue
    
    dir_name = os.path.dirname(filepath)
    print(f"\nChecking file: {filepath}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    matches = link_pattern.findall(content)
    for text, url in matches:
        if url.startswith('http://') or url.startswith('https://') or url.startswith('#') or url.startswith('mailto:'):
            continue
            
        total_links += 1
        clean_url = url.split('#')[0]
        if not clean_url:
            continue
            
        if clean_url.startswith('/'):
            target_path = clean_url.lstrip('/')
        else:
            target_path = os.path.normpath(os.path.join(dir_name, clean_url))
            
        if os.path.exists(target_path):
            print(f"  [PASS] [{text}]({url}) -> {target_path}")
        else:
            print(f"  [FAIL] [{text}]({url}) -> {target_path} (NOT FOUND)")
            broken_links += 1

print(f"\nTotal checked links: {total_links}")
print(f"Broken links: {broken_links}")
if broken_links > 0:
    exit(1)
else:
    exit(0)
