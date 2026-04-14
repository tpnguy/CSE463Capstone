import os
import re

BASE_URL = "https://www.torontocupcake.com/"

# Patterns to fix - relative src/href attributes pointing to local assets
PATTERNS = [
    # img src="images/..." or src='images/...'
    (r'(src=["\'])(?!http)(images/[^"\']+)(["\'])', r'\1' + BASE_URL + r'\2\3'),
    # src="favicon.ico" etc (root-level files)
    (r'(src=["\'])(?!http)(favicon\.ico)(["\'])', r'\1' + BASE_URL + r'\2\3'),
    # href="favicon.ico" or href="apple_touch_icon..."
    (r'(href=["\'])(?!http)(favicon\.ico|apple_touch_icon[^"\']+)(["\'])', r'\1' + BASE_URL + r'\2\3'),
    # srcset with relative paths
    (r'(srcset=["\'])(?!http)(images/[^"\']+)(["\'])', r'\1' + BASE_URL + r'\2\3'),
]

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    for pattern, replacement in PATTERNS:
        content = re.sub(pattern, replacement, content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✔ Fixed: {os.path.basename(filepath)}")
    else:
        print(f"  – No changes: {os.path.basename(filepath)}")

if __name__ == "__main__":
    # Run in the current directory
    html_files = [f for f in os.listdir('.') if f.endswith('.html')]
    if not html_files:
        print("No HTML files found in current directory.")
    else:
        print(f"Found {len(html_files)} HTML files. Fixing image paths...\n")
        for f in sorted(html_files):
            fix_file(f)
        print("\nDone! All relative image paths now point to torontocupcake.com")