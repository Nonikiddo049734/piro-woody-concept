import re
import os
import urllib.request

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

sources = re.findall(r'(?:src|href)="([^"]+)"', content)
assets = [s for s in set(sources) if not s.startswith(('http://', 'https://', 'tel:', 'mailto:', '#', 'data:'))]

broken = []
for a in sorted(assets):
    path = a.split('?')[0].split('#')[0]
    local_path = os.path.normpath(os.path.join('.', path))
    if not os.path.exists(local_path):
        broken.append(f"{a} (File does not exist on disk)")
    else:
        try:
            r = urllib.request.urlopen(f'http://localhost:8080/{path}')
            if r.status != 200:
                broken.append(f'{a} (HTTP {r.status})')
        except Exception as e:
            broken.append(f'{a} ({e})')

print(f'Total assets checked: {len(assets)}')
if broken:
    print('Broken assets found:')
    for b in broken:
        print(' - ', b)
else:
    print('SUCCESS: All assets exist and return HTTP 200!')
