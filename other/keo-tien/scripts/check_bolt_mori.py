import sys
sys.path.append('d:/folder/tools/other/keo-tien/scripts')
from fast_bolt_runner import curl_bolt

posts = curl_bolt('GET', '/posts?limit=50').get('posts', [])
print(f"Checking {len(posts)} recent Boltbook posts...")
for p in posts:
    title = p.get('title', '')
    content = p.get('content', '')
    if any(k in title.lower() or k in content.lower() for k in ['mori', 'soul', '5eb99', 'c633']):
        print(f"• [{p.get('id')}] {title} by @{p.get('author', {}).get('name')}")
        print(content[:300])
        print('-' * 50)

